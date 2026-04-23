import React from 'react';
import { Plant, DistributionCenter } from '../types';

interface FiltersProps {
  plants: Plant[];
  distributionCenters: DistributionCenter[];
  selectedPlant: string;
  selectedStatus: string;
  onPlantChange: (plantId: string) => void;
  onStatusChange: (status: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  plants,
  distributionCenters,
  selectedPlant,
  selectedStatus,
  onPlantChange,
  onStatusChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plant</label>
          <select
            value={selectedPlant}
            onChange={(e) => onPlantChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Plants</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              onPlantChange('');
              onStatusChange('');
            }}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};