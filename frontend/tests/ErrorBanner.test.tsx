import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBanner } from '../src/components/ErrorBanner';

describe('ErrorBanner', () => {
  it('renders the error message', () => {
    render(<ErrorBanner message="Error al cargar datos" onRetry={vi.fn()} />);
    expect(screen.getByText('Error al cargar datos')).toBeDefined();
  });

  it('renders the retry button', () => {
    render(<ErrorBanner message="Error" onRetry={vi.fn()} />);
    expect(screen.getByText('Reintentar')).toBeDefined();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorBanner message="Error" onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Reintentar'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders with correct CSS class', () => {
    render(<ErrorBanner message="Test error" onRetry={vi.fn()} />);
    const banner = document.querySelector('.error-banner');
    expect(banner).not.toBeNull();
  });
});