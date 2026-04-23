import React from 'react';
import { Notificacion } from '../types/models';
import { formatDate } from '../utils/format';

interface Props {
  notificaciones: Notificacion[];
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function NotificacionList({ notificaciones, onDelete, deletingId }: Props) {
  return (
    <div className="notificacion-list">
      <h2>Notificaciones</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pedido ID</th>
            <th>Tipo</th>
            <th>Mensaje</th>
            <th>Fecha Envio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notificaciones.map((notif) => (
            <tr key={notif.id}>
              <td>{notif.id}</td>
              <td>{notif.pedido_id}</td>
              <td>{notif.tipo}</td>
              <td>{notif.mensaje}</td>
              <td>{formatDate(notif.fecha_envio)}</td>
              <td>
                <button onClick={() => onDelete(notif.id)} disabled={deletingId !== null}>
                  {deletingId === notif.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}