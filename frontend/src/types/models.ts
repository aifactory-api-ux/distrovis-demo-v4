export interface Planta {
  id: number;
  nombre: string;
  ubicacion: string;
}

export interface Centro {
  id: number;
  nombre: string;
  ubicacion: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Orden {
  id: number;
  planta_id: number;
  centro_id: number;
  usuario_id: number;
  estado: string;
  unidades: number;
  fecha_creacion: string;
  fecha_entrega: string;
}

export interface KPIResponse {
  total_ordenes: number;
  total_unidades: number;
  ordenes_pendientes: number;
  ordenes_entregadas: number;
  despachos_por_planta: { planta_id: number; total_despachos: number }[];
  despachos_por_centro: { centro_id: number; total_despachos: number }[];
}

export type OrdenEstado = 'pendiente' | 'en_proceso' | 'entregado' | 'cancelado';
