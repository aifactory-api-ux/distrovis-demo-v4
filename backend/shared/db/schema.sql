CREATE TABLE IF NOT EXISTS catalogo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    precio NUMERIC(12,2) NOT NULL,
    stock INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    rol VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id),
    fecha DATE NOT NULL,
    estado VARCHAR(50) NOT NULL,
    total NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido_item (
    pedido_id INTEGER NOT NULL REFERENCES pedido(id),
    catalogo_id INTEGER NOT NULL REFERENCES catalogo(id),
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (pedido_id, catalogo_id)
);

CREATE TABLE IF NOT EXISTS notificacion (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedido(id),
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pedido_usuario_id ON pedido(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedido_fecha ON pedido(fecha);
CREATE INDEX IF NOT EXISTS idx_pedido_estado ON pedido(estado);
CREATE INDEX IF NOT EXISTS idx_pedido_item_pedido_id ON pedido_item(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_item_catalogo_id ON pedido_item(catalogo_id);
CREATE INDEX IF NOT EXISTS idx_notificacion_pedido_id ON notificacion(pedido_id);