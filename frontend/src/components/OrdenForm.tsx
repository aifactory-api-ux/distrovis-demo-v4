import { useState } from 'react';
import { Planta, Centro, Usuario, Orden } from '../types/models';

interface OrdenFormProps {
  onSubmit: (data: Omit<Orden, 'id'>) => Promise<void>;
  loading: boolean;
  plantas: Planta[];
  centros: Centro[];
  usuarios: Usuario[];
}

export function OrdenForm({ onSubmit, loading, plantas, centros, usuarios }: OrdenFormProps) {
  const [plantaId, setPlantaId] = useState<number>(0);
  const [centroId, setCentroId] = useState<number>(0);
  const [usuarioId, setUsuarioId] = useState<number>(0);
  const [estado, setEstado] = useState<string>('pendiente');
  const [unidades, setUnidades] = useState<number>(0);
  const [fechaCreacion, setFechaCreacion] = useState<string>('');
  const [fechaEntrega, setFechaEntrega] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!plantaId || !centroId || !usuarioId || !unidades || !fechaCreacion || !fechaEntrega) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await onSubmit({
        planta_id: plantaId,
        centro_id: centroId,
        usuario_id: usuarioId,
        estado,
        unidades,
        fecha_creacion: fechaCreacion,
        fecha_entrega: fechaEntrega,
      });
      setPlantaId(0);
      setCentroId(0);
      setUsuarioId(0);
      setEstado('pendiente');
      setUnidades(0);
      setFechaCreacion('');
      setFechaEntrega('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear orden');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Planta</label>
          <select value={plantaId} onChange={(e) => setPlantaId(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem' }}>
            <option value={0}>Seleccione planta</option>
            {plantas.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Centro</label>
          <select value={centroId} onChange={(e) => setCentroId(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem' }}>
            <option value={0}>Seleccione centro</option>
            {centros.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Usuario</label>
          <select value={usuarioId} onChange={(e) => setUsuarioId(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem' }}>
            <option value={0}>Seleccione usuario</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Unidades</label>
          <input type="number" value={unidades} onChange={(e) => setUnidades(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Fecha Creacion</label>
          <input type="date" value={fechaCreacion} onChange={(e) => setFechaCreacion(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Fecha Entrega</label>
          <input type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
      </div>

      <button type="submit" disabled={loading} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Creando...' : 'Crear Orden'}
      </button>
    </form>
  );
}
