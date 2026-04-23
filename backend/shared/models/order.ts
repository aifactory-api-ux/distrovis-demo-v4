export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  plant_id: string;
  distribution_center_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}