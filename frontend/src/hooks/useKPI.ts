import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { useCallback } from 'react';
import { fetchKPI } from '../store/kpiSlice';

export const useKPI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const kpiSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { kpi, loading, error } = kpiSelector((state) => state.kpi);

  const fetchKPIData = useCallback(
    (params?: { plant_id?: string; status?: string }) => {
      dispatch(fetchKPI(params));
    },
    [dispatch]
  );

  return { kpi, loading, error, fetchKPI: fetchKPIData };
};