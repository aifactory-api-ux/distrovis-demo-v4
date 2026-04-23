import React from 'react';

interface PlantData {
  plant: string;
  volume: number;
}

interface Props {
  data: PlantData[];
}

export function VolumeByPlantChart({ data }: Props) {
  const maxVolume = Math.max(...data.map(d => d.volume), 1);

  return (
    <div className="volume-chart">
      <h3>Volumen por Planta</h3>
      <div className="chart-container">
        {data.map((item, index) => (
          <div key={index} className="chart-bar">
            <div
              className="bar"
              style={{ height: `${(item.volume / maxVolume) * 100}%` }}
              title={`${item.plant}: ${item.volume}`}
            />
            <span className="label">{item.plant}</span>
          </div>
        ))}
      </div>
    </div>
  );
}