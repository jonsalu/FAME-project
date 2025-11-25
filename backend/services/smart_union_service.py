import pandas as pd
import tempfile
import zipfile
import os

class UniaoService:

    @staticmethod
    def obter_cabecalhos(file):
        file.seek(0)  # Garante que lê do início
        df = pd.read_excel(file)
        return df.columns.tolist()

    @staticmethod
    def unir_planilhas(file1, file2, coluna_chave ):
        """
        tipo_uniao: 'inner', 'left', 'right' ou 'outer'
        """
        
        # Garante leitura do início
        file1.seek(0)
        file2.seek(0)

        df1 = pd.read_excel(file1)
        df2 = pd.read_excel(file2)

        # --- NORMALIZAÇÃO INTELIGENTE ---
        # Cria colunas temporárias para fazer o match, preservando os dados originais
        # Isso evita que o ID fique modificado na saída final (ex: tudo maiúsculo) se você não quiser
        
        chave_temp = "__key_temp__"
        df1[chave_temp] = df1[coluna_chave].astype(str).str.strip().str.upper()
        df2[chave_temp] = df2[coluna_chave].astype(str).str.strip().str.upper()

        # --- UNIÃO ---
        # suffixes: Renomeia colunas iguais automaticamente para _Planilha1 e _Planilha2
        df_merged = df1.merge(
            df2, 
            left_on=chave_temp, 
            right_on=chave_temp, 
            how="outer", 
            suffixes=('_Base', '_Secundaria')
        )

        col_base = f"{coluna_chave}_Base"       # Ex: ID_Base
        col_sec = f"{coluna_chave}_Secundaria"  # Ex: ID_Secundaria

        # Verifica se o Pandas separou a coluna em duas (isso acontece se o nome for igual nas duas)
        if col_base in df_merged.columns and col_sec in df_merged.columns:
            # A MÁGICA: Cria uma coluna oficial "ID" pegando do Base. 
            # Se for vazio (caso do fantasma), ele pega do Secundaria.
            df_merged[coluna_chave] = df_merged[col_base].combine_first(df_merged[col_sec])
            
            # AGORA SIM você pode apagar as colunas sujas com sufixo, pois já salvou os dados na oficial
            df_merged.drop(columns=[col_base, col_sec], inplace=True)
            
        elif col_sec in df_merged.columns and coluna_chave not in df_merged.columns:
             # Caso raro: se a coluna ID só existisse no arquivo 2
             df_merged.rename(columns={col_sec: coluna_chave}, inplace=True)

        # 3. LIMPEZA FINAL
        if chave_temp in df_merged.columns:
            df_merged.drop(columns=[chave_temp], inplace=True)

        # Troca NaN por vazio (estética do Excel)
        df_merged.fillna("", inplace=True)

        # --- EXPORTAÇÃO ---
        temp_dir = tempfile.mkdtemp()
        output_excel = os.path.join(temp_dir, "uniao_resultado.xlsx")
        output_zip = os.path.join(temp_dir, "uniao_resultado.zip")

        df_merged.to_excel(output_excel, index=False)

        with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(output_excel, arcname="uniao_resultado.xlsx")

        return output_zip