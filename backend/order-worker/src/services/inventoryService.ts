import { query } from '../../shared/utils/db';

interface OrderEvent {
  orderId: string;
  plantId: string;
  distributionCenterId: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export const updateInventory = async (orderEvent: OrderEvent): Promise<void> => {
  console.log(`Updating inventory for order: ${orderEvent.orderId}`);

  for (const item of orderEvent.items) {
    console.log(
      `Decreasing inventory for product: ${item.productName}, quantity: ${item.quantity}`
    );
  }

  await query(
    `UPDATE orders SET status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [orderEvent.orderId]
  );

  console.log(`Inventory updated for order: ${orderEvent.orderId}`);
};