export interface Catalogo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  fecha: string;
  estado: string;
  total: number;
  items: PedidoItem[];
}

export interface PedidoItem {
  catalogo_id: number;
  cantidad: number;
  precio_unitario: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface Notificacion {
  id: number;
  pedido_id: number;
  tipo: string;
  mensaje: string;
  fecha_envio: string;
}