import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderTable } from '../src/components/OrderTable';
import { Order } from '../src/types';

describe('OrderTable', () => {
  const mockOrders: Order[] = [
    {
      id: 'order-1',
      user_id: 'user-1',
      plant_id: 'plant-1',
      distribution_center_id: 'dc-1',
      status: 'pending',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      items: [
        { id: 'item-1', order_id: 'order-1', product_name: 'Product A', quantity: 5, unit_price: 10 },
        { id: 'item-2', order_id: 'order-1', product_name: 'Product B', quantity: 3, unit_price: 15 },
      ],
    },
    {
      id: 'order-2',
      user_id: 'user-1',
      plant_id: 'plant-2',
      distribution_center_id: 'dc-2',
      status: 'completed',
      created_at: '2024-01-14T08:00:00Z',
      updated_at: '2024-01-16T12:00:00Z',
      items: [
        { id: 'item-3', order_id: 'order-2', product_name: 'Product C', quantity: 2, unit_price: 20 },
      ],
    },
  ];

  it('should render loading skeleton when loading', () => {
    render(<OrderTable orders={[]} loading={true} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    expect(screen.getByText(/plant/i)).toBeInTheDocument();
    expect(screen.getByText(/center/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/dispatch date/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery date/i)).toBeInTheDocument();
  });

  it('should render order data correctly', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    expect(screen.getByText(/plant-1\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/dc-1\.\.\./i)).toBeInTheDocument();
  });

  it('should calculate total quantity from items', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('should render status badges with correct styling', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    const pendingBadge = screen.getByText('pending');
    const completedBadge = screen.getByText('completed');

    expect(pendingBadge.className).toContain('bg-yellow-100');
    expect(completedBadge.className).toContain('bg-green-100');
  });

  it('should show pagination when totalPages > 1', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('should not show pagination when totalPages is 1', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    expect(screen.queryByText(/page 1 of 1/i)).not.toBeInTheDocument();
  });

  it('should disable previous button on first page', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={3} onPageChange={() => {}} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={3} totalPages={3} onPageChange={() => {}} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when next is clicked', () => {
    const mockPageChange = vi.fn();
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={3} onPageChange={mockPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(mockPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous is clicked', () => {
    const mockPageChange = vi.fn();
    render(<OrderTable orders={mockOrders} loading={false} currentPage={2} totalPages={3} onPageChange={mockPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(mockPageChange).toHaveBeenCalledWith(1);
  });

  it('should show order details modal when order row is clicked', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    fireEvent.click(screen.getByText(/plant-1\.\.\./i));

    expect(screen.getByText(/order details/i)).toBeInTheDocument();
    expect(screen.getByText(/order-1/i)).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    fireEvent.click(screen.getByText(/plant-1\.\.\./i));
    expect(screen.getByText(/order details/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByText(/order details/i)).not.toBeInTheDocument();
  });

  it('should render order items in modal', () => {
    render(<OrderTable orders={mockOrders} loading={false} currentPage={1} totalPages={1} onPageChange={() => {}} />);

    fireEvent.click(screen.getByText(/plant-1\.\.\./i));

    expect(screen.getByText(/product a/i)).toBeInTheDocument();
    expect(screen.getByText(/product b/i)).toBeInTheDocument();
  });
});