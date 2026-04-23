import { query, transaction } from '../config/db';
import { getCache, setCache, deleteCache } from '../config/redis';
import { Catalogo } from '../../../shared/models';
import { PoolClient } from 'pg';

const CACHE_KEY = 'catalogo:all';
const CACHE_TTL = 300;

export async function getAllCatalogo(): Promise<Catalogo[]> {
  const cached = await getCache(CACHE_KEY);
  if (cached) {
    return cached as Catalogo[];
  }

  const result = await query<Catalogo>('SELECT id, nombre, descripcion, precio, stock FROM catalogo ORDER BY id');
  const catalogos = result.rows;
  await setCache(CACHE_KEY, catalogos, CACHE_TTL);
  return catalogos;
}

export async function getCatalogoById(id: number): Promise<Catalogo | null> {
  const cacheKey = `catalogo:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached as Catalogo;
  }

  const result = await query<Catalogo>('SELECT id, nombre, descripcion, precio, stock FROM catalogo WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return null;
  }
  const catalogo = result.rows[0];
  await setCache(cacheKey, catalogo, CACHE_TTL);
  return catalogo;
}

export async function createCatalogo(data: Omit<Catalogo, 'id'>): Promise<Catalogo> {
  const result = await query<Catalogo>(
    'INSERT INTO catalogo (nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4) RETURNING id, nombre, descripcion, precio, stock',
    [data.nombre, data.descripcion, data.precio, data.stock]
  );
  await deleteCache(CACHE_KEY);
  return result.rows[0];
}

export async function updateCatalogo(id: number, data: Partial<Omit<Catalogo, 'id'>>): Promise<Catalogo | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.nombre !== undefined) {
    fields.push(`nombre = $${paramIndex++}`);
    values.push(data.nombre);
  }
  if (data.descripcion !== undefined) {
    fields.push(`descripcion = $${paramIndex++}`);
    values.push(data.descripcion);
  }
  if (data.precio !== undefined) {
    fields.push(`precio = $${paramIndex++}`);
    values.push(data.precio);
  }
  if (data.stock !== undefined) {
    fields.push(`stock = $${paramIndex++}`);
    values.push(data.stock);
  }

  if (fields.length === 0) {
    return getCatalogoById(id);
  }

  values.push(id);
  const result = await query<Catalogo>(
    `UPDATE catalogo SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, nombre, descripcion, precio, stock`,
    values
  );

  if (result.rows.length === 0) {
    return null;
  }

  await deleteCache(CACHE_KEY);
  await deleteCache(`catalogo:${id}`);
  return result.rows[0];
}

export async function deleteCatalogo(id: number): Promise<boolean> {
  const result = await query('DELETE FROM catalogo WHERE id = $1', [id]);
  await deleteCache(CACHE_KEY);
  await deleteCache(`catalogo:${id}`);
  return (result.rowCount ?? 0) > 0;
}