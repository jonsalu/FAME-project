from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
import json
from io import BytesIO

from backend.services.empty_cells_service import processAndMarkMissing

# Criação do router com prefixo e tag
router = APIRouter(prefix="/celulas-vazias", tags=["Células Vazias"])

@router.post("/")
async def marcar_linhas_incompletas(
    file: UploadFile = File(..., alias="file"),
    selected_headers: str = Form(..., alias="selected_headers")
):
    try:
        nomes_colunas: List[str] = json.loads(selected_headers)
        # Chama a função de processamento
        zip_data = await processAndMarkMissing(file, nomes_colunas)

        # Retorna o arquivo zipado como StreamingResponse
        return StreamingResponse(
            BytesIO(zip_data),
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="empty_cells_result.zip"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
