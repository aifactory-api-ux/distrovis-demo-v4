import { Planta } from '../types/models';

interface PlantaListProps {
  plantas: Planta[];
  loading: boolean;
}

export function PlantaList({ plantas, loading }: PlantaListProps) {
  if (loading) {
    return <div>Cargando plantas...</div>;
  }

  return (
    <div>
      <h2>Plantas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {plantas.map((planta) => (
          <div key={planta.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{planta.nombre}</h3>
            <p style={{ margin: 0, color: '#666' }}>{planta.ubicacion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
