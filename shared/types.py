from pydantic import BaseModel, EmailStr
from typing import List


class Planta(BaseModel):
    id: int
    nombre: str
    ubicacion: str


class Centro(BaseModel):
    id: int
    nombre: str
    ubicacion: str


class Usuario(BaseModel):
    id: int
    nombre: str
    email: EmailStr


class Orden(BaseModel):
    id: int
    planta_id: int
    centro_id: int
    usuario_id: int
    estado: str
    unidades: int
    fecha_creacion: str
    fecha_entrega: str


class KPIResponse(BaseModel):
    total_ordenes: int
    total_unidades: int
    ordenes_pendientes: int
    ordenes_entregadas: int
    despachos_por_planta: List[dict]
    despachos_por_centro: List[dict]
