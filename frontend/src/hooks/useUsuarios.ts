import { useState, useEffect } from 'react';
import { Usuario } from '../types/models';
import { getUsuarios } from '../api/usuarioApi';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  return { usuarios, loading, error };
}
