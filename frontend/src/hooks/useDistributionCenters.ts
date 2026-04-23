import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { useCallback } from 'react';
import { fetchDistributionCenters } from '../store/distributionCentersSlice';

export const useDistributionCenters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dcSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { distributionCenters, loading, error } = dcSelector((state) => state.distributionCenters);

  const fetchDCs = useCallback(() => {
    dispatch(fetchDistributionCenters());
  }, [dispatch]);

  return { distributionCenters, loading, error, fetchDistributionCenters: fetchDCs };
};