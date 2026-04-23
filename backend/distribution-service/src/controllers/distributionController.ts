import { Request, Response } from 'express';
import { fetchDistributionCenters } from '../services/distributionService';

export const listDistributionCenters = async (req: Request, res: Response): Promise<void> => {
  try {
    const distributionCenters = await fetchDistributionCenters();
    res.json({ distribution_centers: distributionCenters });
  } catch (error) {
    console.error('List distribution centers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};