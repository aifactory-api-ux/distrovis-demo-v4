from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.dependencies import get_db, get_cached_kpis, set_cached_kpis
from src.crud import get_plantas, get_centros, get_usuarios, get_ordenes, create_orden as crud_create_orden, get_kpis
from src.schemas import Planta, Centro, Usuario, Orden, OrdenCreate, KPIResponse

router = APIRouter()


@router.get("/api/kpis", response_model=KPIResponse)
async def get_kpis_endpoint(db: Session = Depends(get_db)):
    cached = await get_cached_kpis()
    if cached:
        return cached
    kpis = get_kpis(db)
    await set_cached_kpis(kpis)
    return kpis


@router.get("/api/ordenes", response_model=List[Orden])
def get_ordenes_endpoint(db: Session = Depends(get_db)):
    return get_ordenes(db)


@router.post("/api/ordenes", response_model=Orden, status_code=201)
def create_orden_endpoint(orden_data: OrdenCreate, db: Session = Depends(get_db)):
    return crud_create_orden(db, orden_data)


@router.get("/api/plantas", response_model=List[Planta])
def get_plantas_endpoint(db: Session = Depends(get_db)):
    plantas = get_plantas(db)
    return [
        {"id": p.id, "nombre": p.nombre, "ubicacion": p.ubicacion}
        for p in plantas
    ]


@router.get("/api/centros", response_model=List[Centro])
def get_centros_endpoint(db: Session = Depends(get_db)):
    centros = get_centros(db)
    return [
        {"id": c.id, "nombre": c.nombre, "ubicacion": c.ubicacion}
        for c in centros
    ]


@router.get("/api/usuarios", response_model=List[Usuario])
def get_usuarios_endpoint(db: Session = Depends(get_db)):
    usuarios = get_usuarios(db)
    return [
        {"id": u.id, "nombre": u.nombre, "email": u.email}
        for u in usuarios
    ]
