import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICards } from '../src/components/KPICards';
import { KPIResponse } from '../src/types';

describe('KPICards', () => {
  const mockKPI: KPIResponse = {
    total_units: 1500,
    total_orders: 300,
    completed_orders: 250,
    pending_orders: 50,
  };

  it('should render loading skeleton when loading', () => {
    render(<KPICards kpi={null} loading={true} error={null} />);

    const skeletonCards = screen.getAllByRole('status');
    expect(skeletonCards.length).toBe(4);
  });

  it('should render error message when error is present', () => {
    render(<KPICards kpi={null} loading={false} error="Failed to load" />);

    expect(screen.getByText(/error loading kpis/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('should not render when kpi is null and not loading', () => {
    const { container } = render(<KPICards kpi={null} loading={false} error={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render KPI cards with correct data', () => {
    render(<KPICards kpi={mockKPI} loading={false} error={null} />);

    expect(screen.getByText('Total Units')).toBeInTheDocument();
    expect(screen.getByText('Completed Orders')).toBeInTheDocument();
    expect(screen.getByText('Avg Delivery Days')).toBeInTheDocument();
    expect(screen.getByText('Fulfillment Rate')).toBeInTheDocument();
  });

  it('should display formatted numbers', () => {
    render(<KPICards kpi={mockKPI} loading={false} error={null} />);

    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('should calculate fulfillment rate correctly', () => {
    render(<KPICards kpi={mockKPI} loading={false} error={null} />);

    const fulfillmentRate = (250 / 300) * 100;
    expect(screen.getByText(`${fulfillmentRate.toFixed(1)}%`)).toBeInTheDocument();
  });

  it('should handle zero orders gracefully', () => {
    const zeroKPI: KPIResponse = {
      total_units: 0,
      total_orders: 0,
      completed_orders: 0,
      pending_orders: 0,
    };

    render(<KPICards kpi={zeroKPI} loading={false} error={null} />);

    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('should display hardcoded average delivery days', () => {
    render(<KPICards kpi={mockKPI} loading={false} error={null} />);

    expect(screen.getByText('3.5')).toBeInTheDocument();
  });
});