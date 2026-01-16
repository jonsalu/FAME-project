from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from backend.services.compare_service import comparar_planilhas
from io import BytesIO

router = APIRouter(prefix="/compare", tags=["Comparação"])

@router.post("/")
async def comparar(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    modo: str = Form("download") 
):
    try:
        # Chama a função unificada
        resultado = await comparar_planilhas(file1, file2, modo=modo)

        # SE FOR DICIONÁRIO -> É PREVIEW (JSON)
        if isinstance(resultado, dict):
            return JSONResponse(content=resultado)

        # SE NÃO FOR DICIONÁRIO -> É BYTES (ZIP)
        else:
            return StreamingResponse(
                resultado,
                media_type="application/zip",
                headers={"Content-Disposition": 'attachment; filename="resultado_comparacao.zip"'}
            )

    except Exception as e:
        print(f"Erro no processamento: {e}")
        raise HTTPException(status_code=500, detail=str(e))