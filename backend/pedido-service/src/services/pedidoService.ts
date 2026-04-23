import { query, transaction } from '../config/db';
import { getCache, setCache, deleteCache } from '../config/redis';
import { Pedido, PedidoItem } from '../../../shared/models';
import { publishPedidoCreado } from '../events/pedidoEvents';
import { PoolClient } from 'pg';

const CACHE_KEY = 'pedidos:all';
const CACHE_TTL = 300;

export async function getAllPedidos(): Promise<Pedido[]> {
  const cached = await getCache(CACHE_KEY);
  if (cached) {
    return cached as Pedido[];
  }

  const result = await query<any>('SELECT id, usuario_id, fecha, estado, total FROM pedido ORDER BY id');
  const pedidos: Pedido[] = [];

  for (const row of result.rows) {
    const itemsResult = await query<PedidoItem>(
      'SELECT catalogo_id, cantidad, precio_unitario FROM pedido_item WHERE pedido_id = $1',
      [row.id]
    );
    pedidos.push({
      id: row.id,
      usuario_id: row.usuario_id,
      fecha: row.fecha.toISOString().split('T')[0],
      estado: row.estado,
      total: parseFloat(row.total),
      items: itemsResult.rows,
    });
  }

  await setCache(CACHE_KEY, pedidos, CACHE_TTL);
  return pedidos;
}

export async function getPedidoById(id: number): Promise<Pedido | null> {
  const cacheKey = `pedido:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached as Pedido;
  }

  const result = await query<any>('SELECT id, usuario_id, fecha, estado, total FROM pedido WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  const itemsResult = await query<PedidoItem>(
    'SELECT catalogo_id, cantidad, precio_unitario FROM pedido_item WHERE pedido_id = $1',
    [id]
  );

  const pedido: Pedido = {
    id: row.id,
    usuario_id: row.usuario_id,
    fecha: row.fecha.toISOString().split('T')[0],
    estado: row.estado,
    total: parseFloat(row.total),
    items: itemsResult.rows,
  };

  await setCache(cacheKey, pedido, CACHE_TTL);
  return pedido;
}

export async function createPedido(data: Omit<Pedido, 'id'>): Promise<Pedido> {
  return await transaction(async (client: PoolClient) => {
    const pedidoResult = await client.query<any>(
      'INSERT INTO pedido (usuario_id, fecha, estado, total) VALUES ($1, $2, $3, $4) RETURNING id, usuario_id, fecha, estado, total',
      [data.usuario_id, data.fecha, data.estado, data.total]
    );

    const pedidoRow = pedidoResult.rows[0];
    const pedidoId = pedidoRow.id;

    for (const item of data.items) {
      await client.query(
        'INSERT INTO pedido_item (pedido_id, catalogo_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [pedidoId, item.catalogo_id, item.cantidad, item.precio_unitario]
      );
    }

    const pedido: Pedido = {
      id: pedidoId,
      usuario_id: pedidoRow.usuario_id,
      fecha: pedidoRow.fecha.toISOString().split('T')[0],
      estado: pedidoRow.estado,
      total: parseFloat(pedidoRow.total),
      items: data.items,
    };

    await publishPedidoCreado(pedido);
    await deleteCache(CACHE_KEY);
    return pedido;
  });
}

export async function updatePedido(id: number, data: Partial<Pick<Pedido, 'estado'>>): Promise<Pedido | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.estado !== undefined) {
    fields.push(`estado = $${paramIndex++}`);
    values.push(data.estado);
  }

  if (fields.length === 0) {
    return getPedidoById(id);
  }

  values.push(id);
  const result = await query<any>(
    `UPDATE pedido SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, usuario_id, fecha, estado, total`,
    values
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  const itemsResult = await query<PedidoItem>(
    'SELECT catalogo_id, cantidad, precio_unitario FROM pedido_item WHERE pedido_id = $1',
    [id]
  );

  const pedido: Pedido = {
    id: row.id,
    usuario_id: row.usuario_id,
    fecha: row.fecha.toISOString().split('T')[0],
    estado: row.estado,
    total: parseFloat(row.total),
    items: itemsResult.rows,
  };

  await deleteCache(CACHE_KEY);
  await deleteCache(`pedido:${id}`);
  return pedido;
}

export async function deletePedido(id: number): Promise<boolean> {
  return await transaction(async (client: PoolClient) => {
    await client.query('DELETE FROM pedido_item WHERE pedido_id = $1', [id]);
    const result = await client.query('DELETE FROM pedido WHERE id = $1', [id]);
    await deleteCache(CACHE_KEY);
    await deleteCache(`pedido:${id}`);
    return (result.rowCount ?? 0) > 0;
  });
}