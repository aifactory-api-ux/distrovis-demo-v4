export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'operator' | 'viewer';
  };
}