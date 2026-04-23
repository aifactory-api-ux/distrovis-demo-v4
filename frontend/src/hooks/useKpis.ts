import { useState, useEffect, useCallback } from 'react';
import { KPIResponse } from '../types/models';
import { getKpis } from '../api/kpiApi';

export function useKpis() {
  const [kpis, setKpis] = useState<KPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKpis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getKpis();
      setKpis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching KPIs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  return { kpis, loading, error, refresh: fetchKpis };
}
