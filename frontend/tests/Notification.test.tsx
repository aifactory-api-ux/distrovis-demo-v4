import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Notification } from '../src/components/Notification';

describe('Notification', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render notification with message', () => {
    render(<Notification message="Test message" type="success" onClose={mockOnClose} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<Notification message="Test" type="info" onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /×/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Notification message="Test" type="success" onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should auto-close after 5 seconds', () => {
    render(<Notification message="Test" type="info" onClose={mockOnClose} />);

    vi.advanceTimersByTime(5000);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should clear timer on unmount', () => {
    const { unmount } = render(<Notification message="Test" type="error" onClose={mockOnClose} />);

    unmount();
    vi.advanceTimersByTime(5000);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render success notification with correct styling', () => {
    render(<Notification message="Success message" type="success" onClose={mockOnClose} />);

    const notification = screen.getByText('Success message').parentElement;
    expect(notification?.className).toContain('bg-green-100');
  });

  it('should render error notification with correct styling', () => {
    render(<Notification message="Error message" type="error" onClose={mockOnClose} />);

    const notification = screen.getByText('Error message').parentElement;
    expect(notification?.className).toContain('bg-red-100');
  });

  it('should render info notification with correct styling', () => {
    render(<Notification message="Info message" type="info" onClose={mockOnClose} />);

    const notification = screen.getByText('Info message').parentElement;
    expect(notification?.className).toContain('bg-blue-100');
  });
});