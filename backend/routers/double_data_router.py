import json
from typing import List
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from io import BytesIO
from backend.services.double_data import handleDoubleData

router = APIRouter(tags=["Dados Duplicados"])    

@router.post("/double-data")
async def double_data(
    
    file: UploadFile = File(...),
    columns_to_check: str = Form(None),
    modo: str = Form("download")
    ):
    
    try:
        columns = json.loads(columns_to_check) if columns_to_check else []
        
        result = await handleDoubleData(file, columns, modo)
        print("COLUMNS RECEBIDAS:", columns)

        if modo == "preview":
            return JSONResponse(content=result)
        return StreamingResponse(
            BytesIO(result),
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="double_data_result.zip"'},   
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))