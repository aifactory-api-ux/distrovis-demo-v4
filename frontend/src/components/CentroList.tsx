import { Centro } from '../types/models';

interface CentroListProps {
  centros: Centro[];
  loading: boolean;
}

export function CentroList({ centros, loading }: CentroListProps) {
  if (loading) {
    return <div>Cargando centros...</div>;
  }

  return (
    <div>
      <h2>Centros</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {centros.map((centro) => (
          <div key={centro.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{centro.nombre}</h3>
            <p style={{ margin: 0, color: '#666' }}>{centro.ubicacion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
