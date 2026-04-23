import { query } from '../../shared/utils/db';
import { DistributionCenter } from '../../shared/models/distributionCenter';

export const fetchDistributionCenters = async (): Promise<DistributionCenter[]> => {
  const result = await query('SELECT * FROM distribution_centers ORDER BY name');
  return result.rows as DistributionCenter[];
};