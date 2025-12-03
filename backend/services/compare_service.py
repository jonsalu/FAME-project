from openpyxl import load_workbook
from openpyxl.styles import PatternFill
import zipfile
import io
import datetime

# --- Helpers de Normalização ---
def normalize(value):
    if value is None: return ""
    if isinstance(value, (int, float)) and value == int(value): value = int(value)
    return str(value).strip().upper()

def sanitize(value):
    if isinstance(value, (datetime.date, datetime.datetime)): return value.isoformat()
    return value if value is not None else ""

# --- FUNÇÃO ÚNICA DE COMPARAÇÃO ---
async def comparar_planilhas(file1, file2, modo="download"):
    # 1. Carregar arquivos em memória
    b1 = await file1.read()
    b2 = await file2.read()
    
    wb1 = load_workbook(io.BytesIO(b1))
    wb2 = load_workbook(io.BytesIO(b2))
    sheet1 = wb1.active
    sheet2 = wb2.active

    # Estilos
    verde = PatternFill(start_color="90EE90", end_color="90EE90", fill_type="solid")
    vermelho = PatternFill(start_color="F08080", end_color="F08080", fill_type="solid")

    # 2. Configurar Colunas (Dinâmico: pega o max de colunas das duas)
    max_col = max(sheet1.max_column, sheet2.max_column)
    cols = list(range(1, max_col + 1))

    # 3. Indexar Planilha 2 para busca rápida
    # Mapeia: Conteúdo da Linha -> Lista de índices onde ela aparece na Planilha 2
    index2 = {}
    for r in range(2, sheet2.max_row + 1):
        key = tuple(normalize(sheet2.cell(row=r, column=c).value) for c in cols)
        index2.setdefault(key, []).append(r)

    # Conjunto para rastrear quais linhas da Planilha 2 foram "casadas"
    matched_rows_sheet2 = set()
    
    preview_data = [] # Lista final do JSON

    # ---------------------------------------------------------
    # 4. PROCESSAR PLANILHA 1 (Completa)
    # ---------------------------------------------------------
    for r in range(2, sheet1.max_row + 1):
        key = tuple(normalize(sheet1.cell(row=r, column=c).value) for c in cols)
        
        # Busca match na P2
        match_rows = index2.get(key, [])
        
        status = "vermelho"
        if match_rows:
            status = "verde"
            # Consome o primeiro par disponível da P2 para evitar duplicidade
            r2 = match_rows.pop(0)
            matched_rows_sheet2.add(r2) # Marca que a linha r2 da planilha 2 teve par

        # Ações (Pintar + JSON)
        fill = verde if status == "verde" else vermelho
        
        # Pinta P1
        for c in cols:
            sheet1.cell(row=r, column=c).fill = fill

        # Adiciona ao JSON (Se for preview)
        if modo == "preview":
            row_json = {"origem": "PLANILHA_1", "campos": {}}
            for c in cols:
                header = str(sheet1.cell(row=1, column=c).value or f"C{c}")
                val = sanitize(sheet1.cell(row=r, column=c).value)
                row_json["campos"][header] = {"valor": val, "status": status}
            preview_data.append(row_json)

    # ---------------------------------------------------------
    # 5. PROCESSAR PLANILHA 2 (Completa)
    # ---------------------------------------------------------
    # Agora iteramos a P2 inteira para gerar o JSON completo dela também
    for r in range(2, sheet2.max_row + 1):
        
        # Se a linha 'r' estiver no set matched_rows_sheet2, ela deu match (Verde)
        # Se não estiver, ela sobrou (Vermelho)
        status = "verde" if r in matched_rows_sheet2 else "vermelho"
        fill = verde if status == "verde" else vermelho

        # Pinta P2
        for c in cols:
            sheet2.cell(row=r, column=c).fill = fill
            
        # Adiciona ao JSON (Se for preview)
        if modo == "preview":
            row_json = {"origem": "PLANILHA_2", "campos": {}}
            for c in cols:
                header = str(sheet2.cell(row=1, column=c).value or f"C{c}")
                val = sanitize(sheet2.cell(row=r, column=c).value)
                row_json["campos"][header] = {"valor": val, "status": status}
            preview_data.append(row_json)

    # ---------------------------------------------------------
    # 6. RETORNO (Decisão Unificada)
    # ---------------------------------------------------------
    if modo == "preview":
        return {"dados": preview_data}

    # Gera ZIP se for download
    out1 = io.BytesIO()
    out2 = io.BytesIO()
    wb1.save(out1)
    wb2.save(out2)
    
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("planilha_base_verificada.xlsx", out1.getvalue())
        z.writestr("planilha_nova_verificada.xlsx", out2.getvalue())
    
    zip_buffer.seek(0)
    return zip_buffer