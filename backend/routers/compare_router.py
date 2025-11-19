# backend/routers/compare_router.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO
from backend.services.compare_service import comparar_planilhas

router = APIRouter(prefix="/compare", tags=["Comparação"])

@router.post("/")
async def compare(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        zip_bytes = await comparar_planilhas(file1, file2)
        return StreamingResponse(
            BytesIO(zip_bytes),
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="result.zip"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
