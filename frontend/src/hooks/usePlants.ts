import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { useCallback } from 'react';
import { fetchPlants } from '../store/plantsSlice';

export const usePlants = () => {
  const dispatch = useDispatch<AppDispatch>();
  const plantsSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { plants, loading, error } = plantsSelector((state) => state.plants);

  const fetchPlantsList = useCallback(() => {
    dispatch(fetchPlants());
  }, [dispatch]);

  return { plants, loading, error, fetchPlants: fetchPlantsList };
};