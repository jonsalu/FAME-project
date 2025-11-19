import pandas as pd
import openpyxl
from openpyxl.styles import PatternFill
from fastapi import UploadFile
from typing import List
import io
import zipfile

FILL_VERMELHO = PatternFill(start_color="FFFF0000", end_color= "FFFF0000", fill_type="solid")



import pandas as pd
import openpyxl
from openpyxl.styles import PatternFill
# IMPORTANTE: Importar o UploadFile do FastAPI
from fastapi import UploadFile 
from typing import List
import io
import zipfile

# 1. Definição da Cor de Marcação
FILL_AMARELO = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")

# 2. Corrigir a definição da função para ser assíncrona (async def)
async def processAndMarkMissing(file: UploadFile, colunas_obrigatorias: List[str]) -> bytes:
    """
    Processa o arquivo Excel, identifica linhas com células vazias nas 
    colunas obrigatórias e marca a linha inteira. Retorna o arquivo zipado em bytes.
    """
    
    # 1. Leitura do Arquivo e Preparação (Pandas)
    
    # Le o conteúdo do arquivo EM MEMÓRIA (AWAIT É NECESSÁRIO)
    conteudo_arquivo = await file.read() 
    arquivo_bytes_io = io.BytesIO(conteudo_arquivo)
    
    # ... O resto do código (Lógica Pandas/Openpyxl) ...

    # Carrega o arquivo para um DataFrame do Pandas
    df = pd.read_excel(arquivo_bytes_io)

    # 2. Lógica de Detecção de Linhas Incompletas
    
    # Filtra o DataFrame apenas com as colunas obrigatórias
    df_filtrado = df[colunas_obrigatorias]
    
    # Verifica quais linhas possuem pelo menos um valor vazio (True = incompleta)
    linhas_incompletas = df_filtrado.isnull().any(axis=1)
    
    # Extrai os índices do Pandas (começando em 0) para as linhas incompletas
    indices_para_marcar = df.index[linhas_incompletas].tolist()
    
    # 3. Formatação e Gravação (Openpyxl)
    
    # Carrega a pasta de trabalho novamente (Openpyxl precisa do arquivo original)
    # IMPORTANTE: Rebobinar o buffer para que o openpyxl o leia
    arquivo_bytes_io.seek(0)
    wb = openpyxl.load_workbook(arquivo_bytes_io)
    ws = wb.active # Pega a planilha ativa
    
    # Itera sobre os índices e marca a linha no Excel
    for pandas_index in indices_para_marcar:
        linha_excel = pandas_index + 2 
        for cell in ws[linha_excel]:
            cell.fill = FILL_VERMELHO
            
    # Salva o arquivo modificado em um novo buffer de memória
    arquivo_saida_io = io.BytesIO()
    wb.save(arquivo_saida_io)
    arquivo_saida_io.seek(0) # Volta o ponteiro para o início para leitura
    
    # 4. Zippando o Arquivo (Para garantir o StreamingResponse)
    
    nome_saida = f"incompletas_marcadas_{file.filename}"
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(nome_saida, arquivo_saida_io.read())
        
    zip_buffer.seek(0)
    
    # Retorna o conteúdo do ZIP como bytes
    return zip_buffer.read()