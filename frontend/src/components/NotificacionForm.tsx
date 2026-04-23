import React, { useState } from 'react';
import { Notificacion } from '../types/models';

interface Props {
  onSubmit: (data: Omit<Notificacion, 'id'>) => void;
  loading: boolean;
  initialData?: Omit<Notificacion, 'id'>;
}

export function NotificacionForm({ onSubmit, loading, initialData }: Props) {
  const [pedido_id, setPedidoId] = useState(initialData?.pedido_id || 0);
  const [tipo, setTipo] = useState(initialData?.tipo || '');
  const [mensaje, setMensaje] = useState(initialData?.mensaje || '');
  const [fecha_envio, setFechaEnvio] = useState(initialData?.fecha_envio || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ pedido_id, tipo, mensaje, fecha_envio });
  };

  return (
    <form onSubmit={handleSubmit} className="notificacion-form">
      <h3>{initialData ? 'Editar' : 'Nueva'} Notificación</h3>
      <div>
        <label>Pedido ID</label>
        <input type="number" value={pedido_id} onChange={(e) => setPedidoId(parseInt(e.target.value, 10))} required />
      </div>
      <div>
        <label>Tipo</label>
        <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required />
      </div>
      <div>
        <label>Mensaje</label>
        <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} required />
      </div>
      <div>
        <label>Fecha Envio</label>
        <input type="datetime-local" value={fecha_envio} onChange={(e) => setFechaEnvio(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}