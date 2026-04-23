import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendChart } from '../src/components/TrendChart';

describe('TrendChart', () => {
  const mockData = [
    { month: 'Ene', units: 500 },
    { month: 'Feb', units: 750 },
    { month: 'Mar', units: 600 },
    { month: 'Abr', units: 900 },
  ];

  it('renders the chart title', () => {
    render(<TrendChart data={mockData} />);
    expect(screen.getByText('Trend de Unidades (Últimos 6 meses)')).toBeDefined();
  });

  it('renders chart bars for each data point', () => {
    render(<TrendChart data={mockData} />);
    const bars = document.querySelectorAll('.chart-bar');
    expect(bars.length).toBe(4);
  });

  it('renders month labels', () => {
    render(<TrendChart data={mockData} />);
    expect(screen.getByText('Ene')).toBeDefined();
    expect(screen.getByText('Feb')).toBeDefined();
    expect(screen.getByText('Mar')).toBeDefined();
    expect(screen.getByText('Abr')).toBeDefined();
  });

  it('handles empty data array', () => {
    render(<TrendChart data={[]} />);
    const bars = document.querySelectorAll('.chart-bar');
    expect(bars.length).toBe(0);
  });

  it('handles data with zero values', () => {
    const dataWithZeros = [
      { month: 'Ene', units: 0 },
      { month: 'Feb', units: 0 },
    ];
    render(<TrendChart data={dataWithZeros} />);
    const bars = document.querySelectorAll('.chart-bar');
    expect(bars.length).toBe(2);
  });

  it('calculates bar heights correctly', () => {
    render(<TrendChart data={mockData} />);
    const bars = document.querySelectorAll('.bar');
    const maxUnits = 900;
    const firstBarHeight = (500 / maxUnits) * 100;
    const firstBar = bars[0] as HTMLElement;
    expect(firstBar.style.height).toBe(`${firstBarHeight}%`);
  });
});