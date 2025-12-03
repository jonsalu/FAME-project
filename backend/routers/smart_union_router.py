from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from backend.services.smart_union_service import UniaoService # Ajuste o import conforme sua pasta real

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
    common_header: str = Form(...),
    apenas_preview: bool = Form(False) # Nova flag
):
    try:
        resultado = UniaoService.unir_planilhas(
            file1.file,
            file2.file,
            common_header,
            preview=apenas_preview
        )

        if apenas_preview:
            # Retorna JSON
            return JSONResponse(content=resultado)
        else:
            # Retorna Arquivo (resultado é uma string path aqui)
            return FileResponse(
                resultado,
                media_type="application/zip",
                filename="uniao_resultado.zip"
            )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Erro ao unir planilhas: {str(e)}"}
        )