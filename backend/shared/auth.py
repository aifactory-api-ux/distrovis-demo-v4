def verify_jwt(token: str) -> dict:
    return {"sub": "user", "roles": []}


def get_current_user(token: str) -> dict:
    return {"id": 1, "nombre": "admin", "email": "admin@example.com", "roles": ["admin"]}
