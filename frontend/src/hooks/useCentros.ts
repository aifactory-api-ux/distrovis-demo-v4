import { useState, useEffect } from 'react';
import { Centro } from '../types/models';
import { getCentros } from '../api/centroApi';

export function useCentros() {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCentros = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCentros();
        setCentros(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching centros');
      } finally {
        setLoading(false);
      }
    };
    fetchCentros();
  }, []);

  return { centros, loading, error };
}
