import { Request, Response } from 'express';
import { fetchPlants } from '../services/plantService';

export const listPlants = async (req: Request, res: Response): Promise<void> => {
  try {
    const plants = await fetchPlants();
    res.json({ plants });
  } catch (error) {
    console.error('List plants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};