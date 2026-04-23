export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface Plant {
  id: string;
  name: string;
  location: string;
}

export interface DistributionCenter {
  id: string;
  name: string;
  address: string;
}

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

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateOrderRequest {
  plant_id: string;
  distribution_center_id: string;
  items: {
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface CreateOrderResponse {
  order: Order;
}

export interface OrderListResponse {
  orders: Order[];
}

export interface KPIResponse {
  total_units: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
}