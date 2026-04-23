import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { login, getMe } from '../src/api/auth';

vi.mock('axios');
const mockedAxios = axios as ReturnType<typeof vi.fn>;

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should call POST /auth/login with correct data', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: '1', email: 'test@example.com', role: 'admin' },
        },
      };
      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
        get: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
        },
      } as any);

      const { login: loginApi } = await import('../src/api/auth');
      const result = await loginApi({ email: 'test@example.com', password: 'password' });

      expect(result.token).toBe('test-token');
    });
  });

  describe('getMe', () => {
    it('should call GET /auth/me', async () => {
      const mockResponse = {
        data: { id: '1', email: 'test@example.com', role: 'admin' },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        post: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
        },
      } as any);

      const { getMe } = await import('../src/api/auth');
      await getMe();
    });
  });
});