import { useState, useEffect } from 'react';
import { Planta } from '../types/models';
import { getPlantas } from '../api/plantaApi';

export function usePlantas() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlantas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPlantas();
        setPlantas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching plantas');
      } finally {
        setLoading(false);
      }
    };
    fetchPlantas();
  }, []);

  return { plantas, loading, error };
}
