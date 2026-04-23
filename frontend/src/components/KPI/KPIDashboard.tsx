import React from 'react';
import { KPIResponse } from '../../types';

interface KPIDashboardProps {
  kpi: KPIResponse | null;
  loading: boolean;
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ kpi, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Loading KPIs...</div>;
  }

  if (!kpi) {
    return <div className="text-center py-8">No KPI data available</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-600">Total Units</p>
        <p className="text-2xl font-bold text-blue-900">{kpi.total_units}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-600">Total Orders</p>
        <p className="text-2xl font-bold text-green-900">{kpi.total_orders}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-purple-600">Completed</p>
        <p className="text-2xl font-bold text-purple-900">{kpi.completed_orders}</p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <p className="text-sm text-orange-600">Pending</p>
        <p className="text-2xl font-bold text-orange-900">{kpi.pending_orders}</p>
      </div>
    </div>
  );
};