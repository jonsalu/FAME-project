import pandas as pd
import tempfile
import zipfile
import os

class UniaoService:

    @staticmethod
    def obter_cabecalhos(file):
        file.seek(0)
        df = pd.read_excel(file)
        return df.columns.tolist()

    @staticmethod
    def unir_planilhas(file1, file2, coluna_chave, preview=False):
        """
        preview: Se True, retorna os dados em JSON. Se False, retorna o caminho do ZIP.
        """
        
        # Garante leitura do início
        file1.seek(0)
        file2.seek(0)

        df1 = pd.read_excel(file1)
        df2 = pd.read_excel(file2)

        # --- NORMALIZAÇÃO INTELIGENTE ---
        chave_temp = "__key_temp__"
        df1[chave_temp] = df1[coluna_chave].astype(str).str.strip().str.upper()
        df2[chave_temp] = df2[coluna_chave].astype(str).str.strip().str.upper()

        # --- UNIÃO ---
        df_merged = df1.merge(
            df2, 
            left_on=chave_temp, 
            right_on=chave_temp, 
            how="outer", 
            suffixes=('_Base', '_Secundaria')
        )

        col_base = f"{coluna_chave}_Base"
        col_sec = f"{coluna_chave}_Secundaria"

        # Lógica de combinação de colunas
        if col_base in df_merged.columns and col_sec in df_merged.columns:
            df_merged[coluna_chave] = df_merged[col_base].combine_first(df_merged[col_sec])
            df_merged.drop(columns=[col_base, col_sec], inplace=True)
            
        elif col_sec in df_merged.columns and coluna_chave not in df_merged.columns:
             df_merged.rename(columns={col_sec: coluna_chave}, inplace=True)

        # 3. LIMPEZA FINAL
        if chave_temp in df_merged.columns:
            df_merged.drop(columns=[chave_temp], inplace=True)

        # Troca NaN por vazio (JSON não aceita NaN e Excel fica feio com NaN)
        df_merged.fillna("", inplace=True)

        # --- DECISÃO: PREVIEW OU ARQUIVO ---
        if preview:
            # Retorna estrutura para JSON
            return {
                "columns": df_merged.columns.tolist(),
                # Retorna apenas as primeiras 100 linhas para não travar o navegador se for gigante
                "data": df_merged.to_dict(orient="records")
            }
        else:
            # --- EXPORTAÇÃO ARQUIVO ---
            temp_dir = tempfile.mkdtemp()
            output_excel = os.path.join(temp_dir, "uniao_resultado.xlsx")
            output_zip = os.path.join(temp_dir, "uniao_resultado.zip")

            df_merged.to_excel(output_excel, index=False)

            with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
                zipf.write(output_excel, arcname="uniao_resultado.xlsx")

            return output_zip