import React from 'react';

interface DataPoint {
  month: string;
  units: number;
}

interface Props {
  data: DataPoint[];
}

export function TrendChart({ data }: Props) {
  const maxUnits = Math.max(...data.map(d => d.units), 1);

  return (
    <div className="trend-chart">
      <h3>Trend de Unidades (Últimos 6 meses)</h3>
      <div className="chart-container">
        {data.map((point, index) => (
          <div key={index} className="chart-bar">
            <div
              className="bar"
              style={{ height: `${(point.units / maxUnits) * 100}%` }}
              title={`${point.month}: ${point.units}`}
            />
            <span className="label">{point.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}