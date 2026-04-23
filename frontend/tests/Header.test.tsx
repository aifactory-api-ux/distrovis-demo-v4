import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../src/components/Header';

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header onToggleTheme={vi.fn()} theme="light" />);
    expect(screen.getByText('Distrovis')).toBeDefined();
  });

  it('renders the dashboard subtitle', () => {
    render(<Header onToggleTheme={vi.fn()} theme="light" />);
    expect(screen.getByText('Dashboard de Pedidos')).toBeDefined();
  });

  it('renders the theme toggle button', () => {
    render(<Header onToggleTheme={vi.fn()} theme="light" />);
    const button = document.querySelector('.theme-toggle');
    expect(button).not.toBeNull();
  });

  it('displays moon emoji in light mode', () => {
    render(<Header onToggleTheme={vi.fn()} theme="light" />);
    expect(screen.getByText('🌙')).toBeDefined();
  });

  it('displays sun emoji in dark mode', () => {
    render(<Header onToggleTheme={vi.fn()} theme="dark" />);
    expect(screen.getByText('☀️')).toBeDefined();
  });

  it('calls onToggleTheme when button is clicked', () => {
    const onToggleTheme = vi.fn();
    render(<Header onToggleTheme={onToggleTheme} theme="light" />);
    fireEvent.click(document.querySelector('.theme-toggle')!);
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });
});