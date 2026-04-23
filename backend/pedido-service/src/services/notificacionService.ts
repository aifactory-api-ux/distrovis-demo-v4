import { query } from '../config/db';
import { getCache, setCache, deleteCache } from '../config/redis';
import { Notificacion } from '../../../shared/models';

const CACHE_KEY = 'notificaciones:all';
const CACHE_TTL = 300;

export async function getAllNotificaciones(): Promise<Notificacion[]> {
  const cached = await getCache(CACHE_KEY);
  if (cached) {
    return cached as Notificacion[];
  }

  const result = await query<any>('SELECT id, pedido_id, tipo, mensaje, fecha_envio FROM notificacion ORDER BY id');
  const notificaciones: Notificacion[] = result.rows.map(row => ({
    id: row.id,
    pedido_id: row.pedido_id,
    tipo: row.tipo,
    mensaje: row.mensaje,
    fecha_envio: row.fecha_envio.toISOString(),
  }));
  await setCache(CACHE_KEY, notificaciones, CACHE_TTL);
  return notificaciones;
}

export async function getNotificacionById(id: number): Promise<Notificacion | null> {
  const cacheKey = `notificacion:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached as Notificacion;
  }

  const result = await query<any>('SELECT id, pedido_id, tipo, mensaje, fecha_envio FROM notificacion WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  const notificacion: Notificacion = {
    id: row.id,
    pedido_id: row.pedido_id,
    tipo: row.tipo,
    mensaje: row.mensaje,
    fecha_envio: row.fecha_envio.toISOString(),
  };
  await setCache(cacheKey, notificacion, CACHE_TTL);
  return notificacion;
}

export async function createNotificacion(data: Omit<Notificacion, 'id'>): Promise<Notificacion> {
  const result = await query<any>(
    'INSERT INTO notificacion (pedido_id, tipo, mensaje, fecha_envio) VALUES ($1, $2, $3, $4) RETURNING id, pedido_id, tipo, mensaje, fecha_envio',
    [data.pedido_id, data.tipo, data.mensaje, data.fecha_envio]
  );
  await deleteCache(CACHE_KEY);
  const row = result.rows[0];
  return {
    id: row.id,
    pedido_id: row.pedido_id,
    tipo: row.tipo,
    mensaje: row.mensaje,
    fecha_envio: row.fecha_envio.toISOString(),
  };
}

export async function deleteNotificacion(id: number): Promise<boolean> {
  const result = await query('DELETE FROM notificacion WHERE id = $1', [id]);
  await deleteCache(CACHE_KEY);
  await deleteCache(`notificacion:${id}`);
  return (result.rowCount ?? 0) > 0;
}