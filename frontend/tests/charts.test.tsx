import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BarChartComponent } from '../src/components/BarChart';
import { LineChartComponent } from '../src/components/LineChart';

describe('Charts', () => {
  describe('BarChartComponent', () => {
    it('should render bar chart with title', () => {
      render(<BarChartComponent />);

      expect(screen.getByText('Volume by Plant')).toBeInTheDocument();
    });

    it('should render bar chart container', () => {
      render(<BarChartComponent />);

      const container = screen.getByText('Volume by Plant').parentElement;
      expect(container).toBeInTheDocument();
    });
  });

  describe('LineChartComponent', () => {
    it('should render line chart with title', () => {
      render(<LineChartComponent />);

      expect(screen.getByText('Units Trend (Last 6 Months)')).toBeInTheDocument();
    });

    it('should render line chart container', () => {
      render(<LineChartComponent />);

      const container = screen.getByText('Units Trend (Last 6 Months)').parentElement;
      expect(container).toBeInTheDocument();
    });
  });
});