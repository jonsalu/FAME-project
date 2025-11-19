# backend/services/compare_service.py
from openpyxl import load_workbook
from openpyxl.styles import PatternFill
from io import BytesIO
import zipfile
import io

# Normalização simples e segura
def normalize(value):
    if value is None:
        return ""
    return str(value).strip().upper()


def process_and_mark(b1: bytes, b2: bytes):
    # Agora SEMPRE comparamos as 3 primeiras colunas
    compare_columns = [1, 2, 3]

    bio1 = io.BytesIO(b1)
    bio2 = io.BytesIO(b2)
    wb1 = load_workbook(bio1)
    wb2 = load_workbook(bio2)
    sheet1 = wb1.active
    sheet2 = wb2.active

    verde = PatternFill(start_color="90EE90", end_color="90EE90", fill_type="solid")
    vermelho = PatternFill(start_color="F08080", end_color="F08080", fill_type="solid")

    # -------------------------
    # Índice da segunda planilha
    # -------------------------
    index2 = {}
    for row in range(2, sheet2.max_row + 1):  # ignora header
        key = tuple(normalize(sheet2.cell(row=row, column=c).value) for c in compare_columns)
        index2.setdefault(key, []).append(row)

    matched_in_sheet2 = set()

    # -------------------------
    # Comparação planilha 1 → 2
    # -------------------------
    for row in range(2, sheet1.max_row + 1):
        key = tuple(normalize(sheet1.cell(row=row, column=c).value) for c in compare_columns)
        match_rows = index2.get(key, [])

        if match_rows:
            # match encontrado → pinta verde somente as colunas comparadas
            for c in compare_columns:
                sheet1.cell(row=row, column=c).fill = verde

            # pega a primeira correspondência da planilha 2
            row2 = match_rows.pop(0)
            matched_in_sheet2.add(row2)

            for c in compare_columns:
                sheet2.cell(row=row2, column=c).fill = verde

        else:
            # sem match → pinta vermelho
            for c in compare_columns:
                sheet1.cell(row=row, column=c).fill = vermelho

    # -------------------------
    # Marcar não comparados na planilha 2
    # -------------------------
    for row in range(2, sheet2.max_row + 1):
        if row not in matched_in_sheet2:
            for c in compare_columns:
                sheet2.cell(row=row, column=c).fill = vermelho

    # -------------------------
    # Exportar resultados
    # -------------------------
    out1 = io.BytesIO()
    out2 = io.BytesIO()
    wb1.save(out1)
    wb2.save(out2)
    wb1.close()
    wb2.close()

    out1.seek(0)
    out2.seek(0)
    return out1.read(), out2.read()


# Função chamada pelo router
async def comparar_planilhas(file1, file2):
    b1 = await file1.read()
    b2 = await file2.read()

    processed1, processed2 = process_and_mark(b1, b2)

    zip_io = io.BytesIO()

    with zipfile.ZipFile(zip_io, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(f"{file1.filename.rsplit('.', 1)[0]}_resultado.xlsx", processed1)
        z.writestr(f"{file2.filename.rsplit('.', 1)[0]}_resultado.xlsx", processed2)

    zip_io.seek(0)
    return zip_io.read()
