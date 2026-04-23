import { query } from '../../shared/utils/db';
import { User } from '../../shared/models/user';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as User;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as User;
};

export const createUser = async (
  email: string,
  passwordHash: string,
  role: 'admin' | 'operator' | 'viewer'
): Promise<User> => {
  const result = await query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
    [email, passwordHash, role]
  );

  return result.rows[0] as User;
};