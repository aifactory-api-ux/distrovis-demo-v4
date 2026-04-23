import { query } from '../../shared/utils/db';
import { Order, OrderItem } from '../../shared/models/order';

interface OrderItemInput {
  product_name: string;
  quantity: number;
  unit_price: number;
}

export const insertOrder = async (
  userId: string,
  plantId: string,
  distributionCenterId: string,
  items: OrderItemInput[]
): Promise<Order> => {
  const client = await (await import('../../shared/utils/db')).getDbConnection().connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, plant_id, distribution_center_id, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [userId, plantId, distributionCenterId]
    );

    const order = orderResult.rows[0] as Order;

    const insertedItems: OrderItem[] = [];

    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, product_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [order.id, item.product_name, item.quantity, item.unit_price]
      );
      insertedItems.push(itemResult.rows[0] as OrderItem);
    }

    await client.query('COMMIT');

    return {
      ...order,
      items: insertedItems,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const fetchOrders = async (
  plantId?: string,
  status?: string
): Promise<Order[]> => {
  let queryText = 'SELECT * FROM orders WHERE 1=1';
  const params: unknown[] = [];
  let paramIndex = 1;

  if (plantId) {
    queryText += ` AND plant_id = $${paramIndex}`;
    params.push(plantId);
    paramIndex++;
  }

  if (status) {
    queryText += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  queryText += ' ORDER BY created_at DESC';

  const ordersResult = await query(queryText, params);
  const orders = ordersResult.rows as Order[];

  for (const order of orders) {
    const itemsResult = await query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [order.id]
    );
    order.items = itemsResult.rows as OrderItem[];
  }

  return orders;
};

export const fetchOrderById = async (id: string): Promise<Order | null> => {
  const result = await query('SELECT * FROM orders WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return null;
  }

  const order = result.rows[0] as Order;

  const itemsResult = await query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [id]
  );

  order.items = itemsResult.rows as OrderItem[];

  return order;
};