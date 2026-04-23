import { describe, it, expect } from 'vitest';
import { User, Plant, DistributionCenter, Order, OrderItem, KPIResponse } from '../src/types';

describe('Types', () => {
  describe('User', () => {
    it('should have correct structure', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        password_hash: 'hash123',
        role: 'admin',
      };
      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('admin');
    });

    it('should accept valid roles', () => {
      const roles: User['role'][] = ['admin', 'operator', 'viewer'];
      roles.forEach(role => {
        const user: User = { id: '1', email: 'test@test.com', password_hash: 'x', role };
        expect(user.role).toBe(role);
      });
    });
  });

  describe('Plant', () => {
    it('should have correct structure', () => {
      const plant: Plant = {
        id: 'plant-1',
        name: 'Test Plant',
        location: 'Test Location',
      };
      expect(plant.id).toBe('plant-1');
      expect(plant.name).toBe('Test Plant');
      expect(plant.location).toBe('Test Location');
    });
  });

  describe('DistributionCenter', () => {
    it('should have correct structure', () => {
      const center: DistributionCenter = {
        id: 'dc-1',
        name: 'Test Center',
        address: 'Test Address',
      };
      expect(center.id).toBe('dc-1');
      expect(center.name).toBe('Test Center');
      expect(center.address).toBe('Test Address');
    });
  });

  describe('OrderItem', () => {
    it('should have correct structure', () => {
      const item: OrderItem = {
        id: 'item-1',
        order_id: 'order-1',
        product_name: 'Product A',
        quantity: 10,
        unit_price: 25.50,
      };
      expect(item.id).toBe('item-1');
      expect(item.product_name).toBe('Product A');
      expect(item.quantity).toBe(10);
      expect(item.unit_price).toBe(25.50);
    });
  });

  describe('Order', () => {
    it('should have correct structure with items', () => {
      const order: Order = {
        id: 'order-1',
        user_id: 'user-1',
        plant_id: 'plant-1',
        distribution_center_id: 'dc-1',
        status: 'pending',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        items: [],
      };
      expect(order.id).toBe('order-1');
      expect(order.status).toBe('pending');
      expect(Array.isArray(order.items)).toBe(true);
    });

    it('should accept valid statuses', () => {
      const statuses: Order['status'][] = ['pending', 'processing', 'completed', 'cancelled'];
      statuses.forEach(status => {
        const order: Order = {
          id: '1', user_id: '1', plant_id: '1', distribution_center_id: '1',
          status, created_at: '', updated_at: '', items: [],
        };
        expect(order.status).toBe(status);
      });
    });
  });

  describe('KPIResponse', () => {
    it('should have correct structure', () => {
      const kpi: KPIResponse = {
        total_units: 1000,
        total_orders: 500,
        completed_orders: 450,
        pending_orders: 50,
      };
      expect(kpi.total_units).toBe(1000);
      expect(kpi.total_orders).toBe(500);
      expect(kpi.completed_orders).toBe(450);
      expect(kpi.pending_orders).toBe(50);
    });
  });
});