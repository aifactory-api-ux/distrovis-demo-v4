from shared.models import Planta as PlantaModel
from shared.models import Centro as CentroModel
from shared.models import Usuario as UsuarioModel
from shared.models import Orden as OrdenModel
from shared.models import OrdenCreate
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime


def get_plantas(db: Session):
    return db.query(PlantaModel).all()


def get_centros(db: Session):
    return db.query(CentroModel).all()


def get_usuarios(db: Session):
    return db.query(UsuarioModel).all()


def get_ordenes(db: Session):
    ordenes = db.query(OrdenModel).all()
    return [
        {
            "id": o.id,
            "planta_id": o.planta_id,
            "centro_id": o.centro_id,
            "usuario_id": o.usuario_id,
            "estado": o.estado,
            "unidades": o.unidades,
            "fecha_creacion": o.fecha_creacion.isoformat() if o.fecha_creacion else None,
            "fecha_entrega": o.fecha_entrega.isoformat() if o.fecha_entrega else None,
        }
        for o in ordenes
    ]


def create_orden(db: Session, orden_data: OrdenCreate):
    orden = OrdenModel(
        planta_id=orden_data.planta_id,
        centro_id=orden_data.centro_id,
        usuario_id=orden_data.usuario_id,
        estado=orden_data.estado,
        unidades=orden_data.unidades,
        fecha_creacion=datetime.fromisoformat(orden_data.fecha_creacion).date(),
        fecha_entrega=datetime.fromisoformat(orden_data.fecha_entrega).date(),
    )
    db.add(orden)
    db.commit()
    db.refresh(orden)
    return {
        "id": orden.id,
        "planta_id": orden.planta_id,
        "centro_id": orden.centro_id,
        "usuario_id": orden.usuario_id,
        "estado": orden.estado,
        "unidades": orden.unidades,
        "fecha_creacion": orden.fecha_creacion.isoformat(),
        "fecha_entrega": orden.fecha_entrega.isoformat(),
    }


def get_kpis(db: Session):
    total_ordenes = db.query(func.count(OrdenModel.id)).scalar()
    total_unidades = db.query(func.sum(OrdenModel.unidades)).scalar() or 0
    ordenes_pendientes = db.query(func.count(OrdenModel.id)).filter(OrdenModel.estado == "pendiente").scalar()
    ordenes_entregadas = db.query(func.count(OrdenModel.id)).filter(OrdenModel.estado == "entregado").scalar()

    despachos_planta = (
        db.query(OrdenModel.planta_id, func.count(OrdenModel.id).label("total"))
        .group_by(OrdenModel.planta_id)
        .all()
    )
    despachos_por_planta = [
        {"planta_id": p.planta_id, "total_despachos": p.total}
        for p in despachos_planta
    ]

    despachos_centro = (
        db.query(OrdenModel.centro_id, func.count(OrdenModel.id).label("total"))
        .group_by(OrdenModel.centro_id)
        .all()
    )
    despachos_por_centro = [
        {"centro_id": c.centro_id, "total_despachos": c.total}
        for c in despachos_centro
    ]

    return {
        "total_ordenes": total_ordenes,
        "total_unidades": total_unidades,
        "ordenes_pendientes": ordenes_pendientes,
        "ordenes_entregadas": ordenes_entregadas,
        "despachos_por_planta": despachos_por_planta,
        "despachos_por_centro": despachos_por_centro,
    }
