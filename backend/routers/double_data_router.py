import json
from typing import List
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO
from backend.services.double_data import handleDoubleData

router = APIRouter(tags=["Dados Duplicados"])    

@router.post("/double-data")
async def double_data(
    
    file: UploadFile = File(...),
    columns_to_check: str = Form(None)):
    
    try:
        columns = json.loads(columns_to_check) if columns_to_check else []
        zip_files = await handleDoubleData(file, columns)
        print("COLUMNS RECEBIDAS:", columns)
        return StreamingResponse(
            BytesIO(zip_files),
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="double_data_result.zip"'},   
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))