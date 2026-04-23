import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from sqlalchemy.orm import Session
from datetime import date
from shared.models import PlantaModel, CentroModel, UsuarioModel, OrdenModel, OrdenEstado


@pytest.fixture
def seed_data(db_session: Session):
    planta = PlantaModel(id=1, nombre="Planta Norte", ubicacion="Norte")
    centro = CentroModel(id=1, nombre="Centro A", ubicacion="Zona A")
    usuario = UsuarioModel(id=1, nombre="Juan", email="juan@test.com")
    db_session.add(planta)
    db_session.add(centro)
    db_session.add(usuario)
    db_session.commit()
    return {"planta": planta, "centro": centro, "usuario": usuario}


class TestHealthCheck:
    def test_health_returns_200(self, client):
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json() == {"status": "healthy"}


class TestGetPlantas:
    def test_get_plantas_empty(self, client):
        res = client.get("/api/plantas")
        assert res.status_code == 200
        assert res.json() == []

    def test_get_plantas_with_data(self, client, seed_data):
        res = client.get("/api/plantas")
        assert res.status_code == 200
        data = res.json()
        assert len(data) == 1
        assert data[0]["nombre"] == "Planta Norte"


class TestGetCentros:
    def test_get_centros_empty(self, client):
        res = client.get("/api/centros")
        assert res.status_code == 200
        assert res.json() == []

    def test_get_centros_with_data(self, client, seed_data):
        res = client.get("/api/centros")
        assert res.status_code == 200
        data = res.json()
        assert len(data) == 1
        assert data[0]["nombre"] == "Centro A"


class TestGetUsuarios:
    def test_get_usuarios_empty(self, client):
        res = client.get("/api/usuarios")
        assert res.status_code == 200
        assert res.json() == []

    def test_get_usuarios_with_data(self, client, seed_data):
        res = client.get("/api/usuarios")
        assert res.status_code == 200
        data = res.json()
        assert len(data) == 1
        assert data[0]["nombre"] == "Juan"


class TestGetOrdenes:
    def test_get_ordenes_empty(self, client):
        res = client.get("/api/ordenes")
        assert res.status_code == 200
        assert res.json() == []

    def test_get_ordenes_with_data(self, client, seed_data, db_session: Session):
        orden = OrdenModel(
            planta_id=1, centro_id=1, usuario_id=1,
            estado=OrdenEstado.PENDIENTE.value,
            unidades=10,
            fecha_creacion=date(2024, 1, 1),
            fecha_entrega=date(2024, 1, 10)
        )
        db_session.add(orden)
        db_session.commit()
        res = client.get("/api/ordenes")
        assert res.status_code == 200
        data = res.json()
        assert len(data) == 1
        assert data[0]["unidades"] == 10
        assert data[0]["estado"] == "pendiente"


class TestCreateOrden:
    def test_create_orden_success(self, client, seed_data):
        orden_data = {
            "planta_id": 1,
            "centro_id": 1,
            "usuario_id": 1,
            "estado": "pendiente",
            "unidades": 5,
            "fecha_creacion": "2024-01-01",
            "fecha_entrega": "2024-01-15"
        }
        res = client.post("/api/ordenes", json=orden_data)
        assert res.status_code == 201
        data = res.json()
        assert data["planta_id"] == 1
        assert data["unidades"] == 5

    def test_create_orden_invalid_planta(self, client, seed_data):
        orden_data = {
            "planta_id": 999,
            "centro_id": 1,
            "usuario_id": 1,
            "estado": "pendiente",
            "unidades": 5,
            "fecha_creacion": "2024-01-01",
            "fecha_entrega": "2024-01-15"
        }
        res = client.post("/api/ordenes", json=orden_data)
        assert res.status_code == 500

    def test_create_orden_invalid_email(self, client, seed_data):
        orden_data = {
            "planta_id": 1,
            "centro_id": 1,
            "usuario_id": 1,
            "estado": "pendiente",
            "unidades": -1,
            "fecha_creacion": "2024-01-01",
            "fecha_entrega": "2024-01-15"
        }
        res = client.post("/api/ordenes", json=orden_data)
        assert res.status_code == 422


class TestGetKpis:
    def test_get_kpis_empty(self, client):
        res = client.get("/api/kpis")
        assert res.status_code == 200
        data = res.json()
        assert data["total_ordenes"] == 0
        assert data["total_unidades"] == 0

    def test_get_kpis_with_ordenes(self, client, seed_data, db_session: Session):
        orden = OrdenModel(
            planta_id=1, centro_id=1, usuario_id=1,
            estado=OrdenEstado.PENDIENTE.value,
            unidades=10,
            fecha_creacion=date(2024, 1, 1),
            fecha_entrega=date(2024, 1, 10)
        )
        db_session.add(orden)
        db_session.commit()
        res = client.get("/api/kpis")
        assert res.status_code == 200
        data = res.json()
        assert data["total_ordenes"] == 1
        assert data["total_unidades"] == 10
        assert data["ordenes_pendientes"] == 1
