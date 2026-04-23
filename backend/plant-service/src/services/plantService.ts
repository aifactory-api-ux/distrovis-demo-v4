import { query } from '../../shared/utils/db';
import { Plant } from '../../shared/models/plant';

export const fetchPlants = async (): Promise<Plant[]> => {
  const result = await query('SELECT * FROM plants ORDER BY name');
  return result.rows as Plant[];
};