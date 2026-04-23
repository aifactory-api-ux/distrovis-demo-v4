import { query } from '../config/db';
import { getCache, setCache, deleteCache } from '../config/redis';
import { Usuario } from '../../../shared/models';

const CACHE_KEY = 'usuarios:all';
const CACHE_TTL = 300;

export async function getAllUsuarios(): Promise<Usuario[]> {
  const cached = await getCache(CACHE_KEY);
  if (cached) {
    return cached as Usuario[];
  }

  const result = await query<Usuario>('SELECT id, nombre, email, rol FROM usuario ORDER BY id');
  const usuarios = result.rows;
  await setCache(CACHE_KEY, usuarios, CACHE_TTL);
  return usuarios;
}

export async function getUsuarioById(id: number): Promise<Usuario | null> {
  const cacheKey = `usuario:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached as Usuario;
  }

  const result = await query<Usuario>('SELECT id, nombre, email, rol FROM usuario WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return null;
  }
  const usuario = result.rows[0];
  await setCache(cacheKey, usuario, CACHE_TTL);
  return usuario;
}

export async function createUsuario(data: Omit<Usuario, 'id'>): Promise<Usuario> {
  const result = await query<Usuario>(
    'INSERT INTO usuario (nombre, email, rol) VALUES ($1, $2, $3) RETURNING id, nombre, email, rol',
    [data.nombre, data.email, data.rol]
  );
  await deleteCache(CACHE_KEY);
  return result.rows[0];
}

export async function updateUsuario(id: number, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.nombre !== undefined) {
    fields.push(`nombre = $${paramIndex++}`);
    values.push(data.nombre);
  }
  if (data.email !== undefined) {
    fields.push(`email = $${paramIndex++}`);
    values.push(data.email);
  }
  if (data.rol !== undefined) {
    fields.push(`rol = $${paramIndex++}`);
    values.push(data.rol);
  }

  if (fields.length === 0) {
    return getUsuarioById(id);
  }

  values.push(id);
  const result = await query<Usuario>(
    `UPDATE usuario SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, nombre, email, rol`,
    values
  );

  if (result.rows.length === 0) {
    return null;
  }

  await deleteCache(CACHE_KEY);
  await deleteCache(`usuario:${id}`);
  return result.rows[0];
}

export async function deleteUsuario(id: number): Promise<boolean> {
  const result = await query('DELETE FROM usuario WHERE id = $1', [id]);
  await deleteCache(CACHE_KEY);
  await deleteCache(`usuario:${id}`);
  return (result.rowCount ?? 0) > 0;
}