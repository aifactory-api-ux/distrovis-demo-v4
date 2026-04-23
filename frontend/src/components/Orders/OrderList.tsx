import React from 'react';
import { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onSelect }) => {
  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelect(order)}
          className="p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Order #{order.id.substring(0, 8)}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};