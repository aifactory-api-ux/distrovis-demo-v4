export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'operator' | 'viewer';
}