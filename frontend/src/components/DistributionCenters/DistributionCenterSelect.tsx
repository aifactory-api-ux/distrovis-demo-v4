import React from 'react';
import { DistributionCenter } from '../../types';

interface DistributionCenterSelectProps {
  distributionCenters: DistributionCenter[];
  value: string;
  onChange: (id: string) => void;
}

export const DistributionCenterSelect: React.FC<DistributionCenterSelectProps> = ({
  distributionCenters,
  value,
  onChange,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select a distribution center</option>
      {distributionCenters.map((center) => (
        <option key={center.id} value={center.id}>
          {center.name}
        </option>
      ))}
    </select>
  );
};