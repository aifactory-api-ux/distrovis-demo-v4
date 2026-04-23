import { Request, Response } from 'express';
import { calculateKPI } from '../services/kpiService';

export const getKPI = async (req: Request, res: Response): Promise<void> => {
  try {
    const plantId = req.query.plant_id as string | undefined;
    const status = req.query.status as string | undefined;

    const kpi = await calculateKPI(plantId, status);

    res.json(kpi);
  } catch (error) {
    console.error('Get KPI error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};