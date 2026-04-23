import React from 'react';
import { formatNumber } from '../utils/format';

interface Props {
  totalUnits: number;
  completedOrders: number;
  avgDeliveryDays: number;
  fulfillmentRate: number;
}

export function KPICards({ totalUnits, completedOrders, avgDeliveryDays, fulfillmentRate }: Props) {
  return (
    <div className="kpi-cards">
      <div className="kpi-card">
        <h3>Total Unidades</h3>
        <p>{formatNumber(totalUnits)}</p>
      </div>
      <div className="kpi-card">
        <h3>Pedidos Completados</h3>
        <p>{formatNumber(completedOrders)}</p>
      </div>
      <div className="kpi-card">
        <h3>Días Promedio Entrega</h3>
        <p>{avgDeliveryDays.toFixed(1)}</p>
      </div>
      <div className="kpi-card">
        <h3>Tasa Cumplimiento</h3>
        <p>{fulfillmentRate.toFixed(1)}%</p>
      </div>
    </div>
  );
}