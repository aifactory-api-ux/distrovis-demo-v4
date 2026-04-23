import React from 'react';
import { Plant } from '../../types';

interface PlantSelectProps {
  plants: Plant[];
  value: string;
  onChange: (id: string) => void;
}

export const PlantSelect: React.FC<PlantSelectProps> = ({ plants, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select a plant</option>
      {plants.map((plant) => (
        <option key={plant.id} value={plant.id}>
          {plant.name}
        </option>
      ))}
    </select>
  );
};