# router_uniao.py
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from backend.services.smart_union_service import UniaoService

router = APIRouter()

@router.post("/uniao-cabecalhos/")
async def uniao_cabecalhos(file1: UploadFile = File(...)):
    try:
        headers = UniaoService.obter_cabecalhos(file1.file)
        return {"headers": headers}

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"detail": f"Erro ao analisar planilha: {str(e)}"}
        )


@router.post("/uniao-inteligente/")
async def uniao_inteligente(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    common_header: str = Form(...)
):
    try:
        zip_path = UniaoService.unir_planilhas(
            file1.file,
            file2.file,
            common_header
        )

        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="uniao_resultado.zip"
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Erro ao unir planilhas: {str(e)}"}
        )
