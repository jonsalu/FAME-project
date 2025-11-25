from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse # Adicione JSONResponse
from typing import List, Union, Dict, Any
import json
from io import BytesIO

# Certifique-se que sua função no service foi atualizada para aceitar o argumento 'modo'
from backend.services.empty_cells_service import processAndMarkMissing

router = APIRouter(prefix="/celulas-vazias", tags=["Células Vazias"])

@router.post("/")
async def marcar_linhas_incompletas(
    file: UploadFile = File(..., alias="file"),
    selected_headers: str = Form(..., alias="selected_headers"),
    mode: str = Form("download", alias="mode") # 1. Novo parâmetro com valor padrão
):
    try:
        nomes_colunas: List[str] = json.loads(selected_headers)
        
        # 2. Passa o 'mode' para a função (Atualize seu service para aceitar isso!)
        resultado = await processAndMarkMissing(file, nomes_colunas, modo=mode)

        # 3. Lógica de decisão da Resposta
        if mode == "preview":
            # Se for preview, o resultado é uma lista de dicionários (JSON)
            return JSONResponse(content={"dados": resultado})
        
        else:
            # Se for download, o resultado são bytes (ZIP)
            return StreamingResponse(
                BytesIO(resultado),
                media_type="application/zip",
                headers={"Content-Disposition": 'attachment; filename="empty_cells_result.zip"'}
            )

    except Exception as e:
        # Dica: É bom logar o erro no console para saber o que houve
        print(f"Erro no processamento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))