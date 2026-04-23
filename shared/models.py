from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum

Base = declarative_base()


class OrdenEstado(str, Enum):
    PENDIENTE = "pendiente"
    EN_PROCESO = "en_proceso"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"


class PlantaModel(Base):
    __tablename__ = "plantas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    ubicacion = Column(String, nullable=False)


class CentroModel(Base):
    __tablename__ = "centros"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    ubicacion = Column(String, nullable=False)


class UsuarioModel(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, nullable=False)


class OrdenModel(Base):
    __tablename__ = "ordenes"

    id = Column(Integer, primary_key=True, index=True)
    planta_id = Column(Integer, ForeignKey("plantas.id"), nullable=False)
    centro_id = Column(Integer, ForeignKey("centros.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    estado = Column(String, nullable=False, default=OrdenEstado.PENDIENTE.value)
    unidades = Column(Integer, nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    fecha_entrega = Column(Date, nullable=False)

    planta = relationship("PlantaModel")
    centro = relationship("CentroModel")
    usuario = relationship("UsuarioModel")


class Planta(BaseModel):
    id: int
    nombre: str
    ubicacion: str

    class Config:
        from_attributes = True


class Centro(BaseModel):
    id: int
    nombre: str
    ubicacion: str

    class Config:
        from_attributes = True


class Usuario(BaseModel):
    id: int
    nombre: str
    email: EmailStr

    class Config:
        from_attributes = True


class Orden(BaseModel):
    id: int
    planta_id: int
    centro_id: int
    usuario_id: int
    estado: str
    unidades: int
    fecha_creacion: str
    fecha_entrega: str

    class Config:
        from_attributes = True


class OrdenCreate(BaseModel):
    planta_id: int
    centro_id: int
    usuario_id: int
    estado: str = OrdenEstado.PENDIENTE.value
    unidades: int
    fecha_creacion: str
    fecha_entrega: str


class DespachoPlanta(BaseModel):
    planta_id: int
    total_despachos: int


class DespachoCentro(BaseModel):
    centro_id: int
    total_despachos: int


class KPIResponse(BaseModel):
    total_ordenes: int
    total_unidades: int
    ordenes_pendientes: int
    ordenes_entregadas: int
    despachos_por_planta: List[DespachoPlanta]
    despachos_por_centro: List[DespachoCentro]
