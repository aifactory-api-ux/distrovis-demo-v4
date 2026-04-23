from datetime import date
from typing import Optional


def parse_date(date_str: str) -> date:
    return date.fromisoformat(date_str)


def format_date(date_obj: date) -> str:
    return date_obj.isoformat()


def seed_data_exists(db):
    from shared.models import PlantaModel
    result = db.query(PlantaModel).first()
    return result is not None


def seed_database(db):
    from shared.models import PlantaModel, CentroModel, UsuarioModel, OrdenModel
    from datetime import date, timedelta

    plantas = [
        PlantaModel(id=1, nombre="Planta Norte", ubicacion="Zona Industrial Norte"),
        PlantaModel(id=2, nombre="Planta Sur", ubicacion="Zona Industrial Sur"),
        PlantaModel(id=3, nombre="Planta Centro", ubicacion="Zona Central"),
    ]
    db.add_all(plantas)

    centros = [
        CentroModel(id=1, nombre="Centro Distribucion Norte", ubicacion="Norte"),
        CentroModel(id=2, nombre="Centro Distribucion Sur", ubicacion="Sur"),
        CentroModel(id=3, nombre="Centro Distribucion Este", ubicacion="Este"),
        CentroModel(id=4, nombre="Centro Distribucion Oeste", ubicacion="Oeste"),
    ]
    db.add_all(centros)

    usuarios = [
        UsuarioModel(id=1, nombre="Juan Perez", email="juan.perez@example.com"),
        UsuarioModel(id=2, nombre="Maria Garcia", email="maria.garcia@example.com"),
        UsuarioModel(id=3, nombre="Carlos Rodriguez", email="carlos.rodriguez@example.com"),
        UsuarioModel(id=4, nombre="Ana Martinez", email="ana.martinez@example.com"),
        UsuarioModel(id=5, nombre="Luis Sanchez", email="luis.sanchez@example.com"),
    ]
    db.add_all(usuarios)

    today = date.today()
    ordenes = [
        OrdenModel(
            id=1, planta_id=1, centro_id=1, usuario_id=1,
            estado="entregado", unidades=100,
            fecha_creacion=today - timedelta(days=30),
            fecha_entrega=today - timedelta(days=25)
        ),
        OrdenModel(
            id=2, planta_id=1, centro_id=2, usuario_id=2,
            estado="entregado", unidades=150,
            fecha_creacion=today - timedelta(days=20),
            fecha_entrega=today - timedelta(days=15)
        ),
        OrdenModel(
            id=3, planta_id=2, centro_id=3, usuario_id=3,
            estado="pendiente", unidades=200,
            fecha_creacion=today - timedelta(days=10),
            fecha_entrega=today + timedelta(days=5)
        ),
        OrdenModel(
            id=4, planta_id=2, centro_id=1, usuario_id=1,
            estado="en_proceso", unidades=75,
            fecha_creacion=today - timedelta(days=5),
            fecha_entrega=today + timedelta(days=10)
        ),
        OrdenModel(
            id=5, planta_id=3, centro_id=4, usuario_id=4,
            estado="pendiente", unidades=300,
            fecha_creacion=today - timedelta(days=3),
            fecha_entrega=today + timedelta(days=7)
        ),
        OrdenModel(
            id=6, planta_id=1, centro_id=3, usuario_id=5,
            estado="entregado", unidades=50,
            fecha_creacion=today - timedelta(days=40),
            fecha_entrega=today - timedelta(days=35)
        ),
        OrdenModel(
            id=7, planta_id=3, centro_id=2, usuario_id=2,
            estado="cancelado", unidades=80,
            fecha_creacion=today - timedelta(days=15),
            fecha_entrega=today - timedelta(days=10)
        ),
        OrdenModel(
            id=8, planta_id=2, centro_id=4, usuario_id=3,
            estado="pendiente", unidades=120,
            fecha_creacion=today - timedelta(days=7),
            fecha_entrega=today + timedelta(days=3)
        ),
    ]
    db.add_all(ordenes)
    db.commit()
