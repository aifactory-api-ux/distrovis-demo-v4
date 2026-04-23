import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../src/components/Auth/LoginForm';
import { AuthRequest } from '../src/types';

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render login form with email and password fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} error={null} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should update email state on input', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} error={null} />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should update password state on input', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} error={null} />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  it('should call onSubmit with form data when submitted', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} error={null} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should display error message when error prop is provided', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} error="Invalid credentials" />);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={true} error={null} />);

    const submitButton = screen.getByRole('button', { name: /logging in/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show loading text when loading', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={true} error={null} />);

    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  });

  it('should have correct placeholder text', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} error={null} />);

    expect(screen.getByPlaceholderText(/admin@distroviz\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password123/i)).toBeInTheDocument();
  });
});