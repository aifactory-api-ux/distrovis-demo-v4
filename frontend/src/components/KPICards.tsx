import React from 'react';
import { KPIResponse } from '../types';

interface KPICardsProps {
  kpi: KPIResponse | null;
  loading: boolean;
  error: string | null;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpi, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
        Error loading KPIs: {error}
      </div>
    );
  }

  if (!kpi) {
    return null;
  }

  const fulfillmentRate = kpi.total_orders > 0
    ? ((kpi.completed_orders / kpi.total_orders) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-blue-100 font-medium mb-2">Total Units</h3>
        <p className="text-3xl font-bold">{kpi.total_units.toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-green-100 font-medium mb-2">Completed Orders</h3>
        <p className="text-3xl font-bold">{kpi.completed_orders.toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-purple-100 font-medium mb-2">Avg Delivery Days</h3>
        <p className="text-3xl font-bold">3.5</p>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-orange-100 font-medium mb-2">Fulfillment Rate</h3>
        <p className="text-3xl font-bold">{fulfillmentRate}%</p>
      </div>
    </div>
  );
};