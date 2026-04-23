import React from 'react';
import { Catalogo } from '../types/models';
import { formatCurrency } from '../utils/format';

interface Props {
  catalogo: Catalogo[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function CatalogoList({ catalogo, onEdit, onDelete, deletingId }: Props) {
  return (
    <div className="catalogo-list">
      <h2>Catálogo</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {catalogo.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
              <td>{formatCurrency(item.precio)}</td>
              <td>{item.stock}</td>
              <td>
                <button onClick={() => onEdit(item.id)} disabled={deletingId !== null}>Editar</button>
                <button onClick={() => onDelete(item.id)} disabled={deletingId !== null}>
                  {deletingId === item.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}