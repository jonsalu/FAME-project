# uniao_service.py
import pandas as pd
import tempfile
import zipfile
import os

class UniaoService:

    @staticmethod
    def obter_cabecalhos(file):
        df = pd.read_excel(file)
        return df.columns.tolist()

    @staticmethod
    def unir_planilhas(file1, file2, coluna_chave):

        df1 = pd.read_excel(file1)
        df2 = pd.read_excel(file2)

        # Normalização
        df1[coluna_chave] = df1[coluna_chave].astype(str).str.strip().str.upper()
        df2[coluna_chave] = df2[coluna_chave].astype(str).str.strip().str.upper()

        # União (inner join)
        df_merged = df1.merge(df2, on=coluna_chave, how="inner")

        # Arquivos temporários
        temp_dir = tempfile.mkdtemp()

        output_excel = os.path.join(temp_dir, "uniao_resultado.xlsx")
        output_zip = os.path.join(temp_dir, "uniao_resultado.zip")

        df_merged.to_excel(output_excel, index=False)

        with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(output_excel, arcname="uniao_resultado.xlsx")

        return output_zip
