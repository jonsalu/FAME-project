from openpyxl import load_workbook
from openpyxl.styles import PatternFill
from io import BytesIO
import zipfile
import io
import datetime


# -------------------------------------------------------
# AUXILIAR
# -------------------------------------------------------
def normalize_text(v):
    print(f"[normalize_text] Recebido: {v}")

    if v is None:
        print("[normalize_text] Valor None -> retorna ''")
        return ""

    normalized = str(v).strip().upper()

    print(f"[normalize_text] Normalizado: {normalized}")

    return normalized


# -------------------------------------------------------
# PROCESSAMENTO
# -------------------------------------------------------
async def processAndMarkMissing(file, columns_to_check=None, modo="download"):
    print("==================================================")
    print("[START] processAndMarkMissing")
    print(f"[INFO] modo={modo}")
    print("==================================================")

    # -------------------------------------------------------
    # LEITURA DO ARQUIVO
    # -------------------------------------------------------
    print("[STEP 1] Lendo arquivo...")

    contents = await file.read()

    print(f"[OK] Arquivo lido | bytes={len(contents)}")

    # -------------------------------------------------------
    # LOAD WORKBOOK
    # -------------------------------------------------------
    print("[STEP 2] Carregando workbook...")

    workbook = load_workbook(BytesIO(contents))

    print("[OK] Workbook carregado")

    sheet = workbook.active

    print(
        f"[INFO] Planilha ativa | linhas={sheet.max_row} | colunas={sheet.max_column}"
    )

    # -------------------------------------------------------
    # DEFINE COLUNAS
    # -------------------------------------------------------
    print("[STEP 3] Definindo colunas para validação...")

    if not columns_to_check:
        print("[WARN] Nenhuma coluna enviada -> usando todas")

        columns_to_check = [
            sheet.cell(row=1, column=c).value
            for c in range(1, sheet.max_column + 1)
        ]

    print(f"[INFO] columns_to_check={columns_to_check}")

    # -------------------------------------------------------
    # ESTILO
    # -------------------------------------------------------
    print("[STEP 4] Criando estilo vermelho...")

    vermelho = PatternFill(
        start_color="FFFF0000",
        end_color="FFFF0000",
        fill_type="solid"
    )

    print("[OK] Estilo criado")

    # -------------------------------------------------------
    # MAPEIA CABEÇALHOS
    # -------------------------------------------------------
    print("[STEP 5] Mapeando cabeçalhos...")

    header_map = {}

    for col in range(1, sheet.max_column + 1):
        raw_header = sheet.cell(row=1, column=col).value

        print(f"[HEADER] coluna={col} valor_original={raw_header}")

        header_value = normalize_text(raw_header)

        if header_value:
            header_map[header_value] = col

            print(
                f"[MAP] '{header_value}' -> coluna {col}"
            )

    print(f"[OK] header_map={header_map}")

    # -------------------------------------------------------
    # CONVERTE NOMES -> ÍNDICES
    # -------------------------------------------------------
    print("[STEP 6] Convertendo colunas para índices...")

    col_indexes = []

    for col_name in columns_to_check:
        print(f"[CHECK] Procurando coluna '{col_name}'")

        norm = normalize_text(col_name)

        if norm in header_map:
            idx = header_map[norm]

            col_indexes.append(idx)

            print(
                f"[FOUND] '{col_name}' encontrada -> índice {idx}"
            )

        else:
            print(
                f"[NOT FOUND] '{col_name}' não existe na planilha"
            )

    print(f"[INFO] col_indexes={col_indexes}")

    if not col_indexes:
        print("[ERROR] Nenhuma coluna válida encontrada")

        workbook.close()

        raise ValueError(
            "Nenhum dos cabeçalhos selecionados foi encontrado."
        )

    # -------------------------------------------------------
    # DETECÇÃO DE VAZIOS
    # -------------------------------------------------------
    print("[STEP 7] Procurando valores vazios...")

    missing_rows = set()

    for i in range(2, sheet.max_row + 1):
        print(f"--------------------------------------")
        print(f"[ROW] Verificando linha {i}")

        is_row_missing = False

        for col_idx in col_indexes:
            cell = sheet.cell(row=i, column=col_idx)

            val = cell.value

            print(
                f"[CELL] linha={i} coluna={col_idx} valor='{val}'"
            )

            if val is None or str(val).strip() == "":
                print(
                    f"[EMPTY FOUND] linha={i} coluna={col_idx}"
                )

                is_row_missing = True

                break

        if is_row_missing:
            print(f"[MARK ROW] Linha {i} adicionada")

            missing_rows.add(i)

    print("======================================")
    print(f"[RESULT] Linhas com vazios={sorted(missing_rows)}")
    print("======================================")

    # -------------------------------------------------------
    # PREVIEW
    # -------------------------------------------------------
    if modo == "preview":
        print("[STEP 8] Modo PREVIEW")

        preview_list = []

        for row in sorted(missing_rows):
            print(f"[PREVIEW] Montando linha {row}")

            row_data = {}

            for col in range(1, sheet.max_column + 1):
                header = sheet.cell(row=1, column=col).value
                value = sheet.cell(row=row, column=col).value

                print(
                    f"[PREVIEW CELL] row={row} col={col} header={header} value={value}"
                )

                if isinstance(value, datetime.datetime):
                    value = value.isoformat()

                elif isinstance(value, (datetime.date, datetime.time)):
                    value = str(value)

                elif value is None:
                    value = None

                else:
                    value = (
                        value
                        if isinstance(value, (int, float, bool, str))
                        else str(value)
                    )

                row_data[header] = value

            preview_list.append(row_data)

        print(
            f"[OK] Preview criado | total={len(preview_list)}"
        )

        workbook.close()

        print("[END] Workbook fechado")

        return preview_list

    # -------------------------------------------------------
    # DOWNLOAD
    # -------------------------------------------------------
    print("[STEP 9] Pintando linhas...")

    for row in missing_rows:
        print(f"[PAINT] Linha {row}")

        for col in range(1, sheet.max_column + 1):
            sheet.cell(row=row, column=col).fill = vermelho

    # -------------------------------------------------------
    # SAVE XLSX
    # -------------------------------------------------------
    print("[STEP 10] Salvando workbook em memória...")

    output = io.BytesIO()

    workbook.save(output)

    print("[OK] Workbook salvo")

    workbook.close()

    print("[OK] Workbook fechado")

    # -------------------------------------------------------
    # ZIP
    # -------------------------------------------------------
    print("[STEP 11] Gerando ZIP...")

    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(
        zip_buffer,
        "w",
        zipfile.ZIP_DEFLATED
    ) as zipf:

        print("[ZIP] Adicionando XLSX no ZIP...")

        zipf.writestr(
            "linhas_vazias_marcadas.xlsx",
            output.getvalue()
        )

    print("[OK] ZIP criado")

    zip_buffer.seek(0)

    final_bytes = zip_buffer.getvalue()

    print(
        f"[END SUCCESS] tamanho_final_zip={len(final_bytes)} bytes"
    )

    print("==================================================")
    print("[FINISHED] processAndMarkMissing")
    print("==================================================")

    return final_bytes