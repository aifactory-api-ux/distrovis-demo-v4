import { Orden, Planta } from '../types/models';

interface OrdenListProps {
  ordenes: Orden[];
  loading: boolean;
  plantas: Planta[];
}

export function OrdenList({ ordenes, loading, plantas }: OrdenListProps) {
  const getPlantaNombre = (plantaId: number) => {
    const planta = plantas.find((p) => p.id === plantaId);
    return planta ? planta.nombre : `Planta ${plantaId}`;
  };

  if (loading) {
    return <div>Cargando ordenes...</div>;
  }

  return (
    <div>
      <h2>Ordenes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#1976d2', color: 'white' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Planta</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Unidades</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha Creacion</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha Entrega</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>{orden.id}</td>
              <td style={{ padding: '0.75rem' }}>{getPlantaNombre(orden.planta_id)}</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: orden.estado === 'entregado' ? '#4caf50' : orden.estado === 'pendiente' ? '#ff9800' : orden.estado === 'en_proceso' ? '#2196f3' : '#f44336',
                  color: 'white',
                  fontSize: '0.875rem'
                }}>
                  {orden.estado}
                </span>
              </td>
              <td style={{ padding: '0.75rem' }}>{orden.unidades}</td>
              <td style={{ padding: '0.75rem' }}>{orden.fecha_creacion}</td>
              <td style={{ padding: '0.75rem' }}>{orden.fecha_entrega}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
