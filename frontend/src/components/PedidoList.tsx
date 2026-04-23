import React from 'react';
import { Pedido } from '../types/models';
import { formatDate, formatCurrency } from '../utils/format';

interface Props {
  pedidos: Pedido[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function PedidoList({ pedidos, onEdit, onDelete, deletingId }: Props) {
  return (
    <div className="pedido-list">
      <h2>Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario ID</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Items</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.usuario_id}</td>
              <td>{formatDate(pedido.fecha)}</td>
              <td>{pedido.estado}</td>
              <td>{formatCurrency(pedido.total)}</td>
              <td>{pedido.items.length}</td>
              <td>
                <button onClick={() => onEdit(pedido.id)} disabled={deletingId !== null}>Editar</button>
                <button onClick={() => onDelete(pedido.id)} disabled={deletingId !== null}>
                  {deletingId === pedido.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}