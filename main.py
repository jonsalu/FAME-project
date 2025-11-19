
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from openpyxl import load_workbook
from openpyxl.styles import PatternFill
import io
import zipfile
import itertools

from backend.routers import compare_router, double_data_router, empty_cells_router, smart_union_router

app = FastAPI(title='Excel Comparator API')

# Allowed front-end origins (development). Edit if your dev server uses a
# different port or add production hostnames when deploying.
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,  # set to True only if you need cookies/auth from the front
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compare_router.router, prefix="/api")
app.include_router(double_data_router.router, prefix="/api")
app.include_router(empty_cells_router.router, prefix = "/api")
app.include_router(smart_union_router.router, prefix="/api")

