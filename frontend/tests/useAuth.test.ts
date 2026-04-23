import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../src/hooks/useAuth';

vi.mock('../api/auth', () => ({
  login: vi.fn(),
}));

import { login as loginApi } from '../api/auth';

describe('useAuth', () => {
  const mockLoginResponse = {
    token: 'test-token-123',
    user: { id: '1', email: 'test@example.com', role: 'admin' },
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should login successfully', async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.token).toBe(mockLoginResponse.token);
    });
    expect(result.current.user).toEqual(mockLoginResponse.user);
    expect(localStorage.getItem('token')).toBe(mockLoginResponse.token);
  });

  it('should handle login error', async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('wrong@example.com', 'wrongpassword');
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.token).toBeNull();
  });

  it('should logout successfully', () => {
    localStorage.setItem('token', 'some-token');

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should have login and logout functions', () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});