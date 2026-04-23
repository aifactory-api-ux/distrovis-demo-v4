import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', units: 4000 },
  { month: 'Feb', units: 3000 },
  { month: 'Mar', units: 5000 },
  { month: 'Apr', units: 4500 },
  { month: 'May', units: 6000 },
  { month: 'Jun', units: 5500 },
];

export const LineChartComponent: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Units Trend (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="units"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};