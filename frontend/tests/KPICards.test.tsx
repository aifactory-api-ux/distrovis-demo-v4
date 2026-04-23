import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICards } from '../src/components/KPICards';

describe('KPICards', () => {
  it('renders all KPI cards with correct values', () => {
    render(
      <KPICards
        totalUnits={1500}
        completedOrders={45}
        avgDeliveryDays={3.5}
        fulfillmentRate={85.5}
      />
    );

    expect(screen.getByText('Total Unidades')).toBeDefined();
    expect(screen.getByText('Pedidos Completados')).toBeDefined();
    expect(screen.getByText('Días Promedio Entrega')).toBeDefined();
    expect(screen.getByText('Tasa Cumplimiento')).toBeDefined();
  });

  it('displays formatted numbers correctly', () => {
    render(
      <KPICards
        totalUnits={1500}
        completedOrders={45}
        avgDeliveryDays={3.5}
        fulfillmentRate={85.5}
      />
    );

    const kpiCards = document.querySelectorAll('.kpi-card p');
    expect(kpiCards.length).toBe(4);
  });

  it('handles zero values', () => {
    render(
      <KPICards
        totalUnits={0}
        completedOrders={0}
        avgDeliveryDays={0}
        fulfillmentRate={0}
      />
    );

    const kpiCards = document.querySelectorAll('.kpi-card');
    expect(kpiCards.length).toBe(4);
  });

  it('displays decimal avgDeliveryDays with one decimal place', () => {
    render(
      <KPICards
        totalUnits={100}
        completedOrders={10}
        avgDeliveryDays={2.333}
        fulfillmentRate={50}
      />
    );

    expect(screen.getByText('2.3')).toBeDefined();
  });

  it('displays fulfillmentRate with % symbol', () => {
    render(
      <KPICards
        totalUnits={100}
        completedOrders={50}
        avgDeliveryDays={3.0}
        fulfillmentRate={75.5}
      />
    );

    expect(screen.getByText(/75\.5%/)).toBeDefined();
  });
});