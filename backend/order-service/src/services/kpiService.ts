import { query } from '../../shared/utils/db';
import { KPIResponse } from '../../shared/types/kpi';

export const calculateKPI = async (
  plantId?: string,
  status?: string
): Promise<KPIResponse> => {
  let ordersQuery = 'SELECT * FROM orders WHERE 1=1';
  const params: unknown[] = [];
  let paramIndex = 1;

  if (plantId) {
    ordersQuery += ` AND plant_id = $${paramIndex}`;
    params.push(plantId);
    paramIndex++;
  }

  if (status) {
    ordersQuery += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  const ordersResult = await query(ordersQuery, params);
  const orders = ordersResult.rows;

  let itemsQuery = `
    SELECT oi.* FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE 1=1
  `;
  const itemsParams: unknown[] = [];
  let itemsParamIndex = 1;

  if (plantId) {
    itemsQuery += ` AND o.plant_id = $${itemsParamIndex}`;
    itemsParams.push(plantId);
    itemsParamIndex++;
  }

  if (status) {
    itemsQuery += ` AND o.status = $${itemsParamIndex}`;
    itemsParams.push(status);
    itemsParamIndex++;
  }

  const itemsResult = await query(itemsQuery, itemsParams);
  const items = itemsResult.rows;

  let totalUnits = 0;
  for (const item of items) {
    totalUnits += item.quantity;
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return {
    total_units: totalUnits,
    total_orders: totalOrders,
    completed_orders: completedOrders,
    pending_orders: pendingOrders,
  };
};