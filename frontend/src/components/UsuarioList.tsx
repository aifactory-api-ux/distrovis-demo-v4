import React from 'react';
import { Usuario } from '../types/models';

interface Props {
  usuarios: Usuario[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function UsuarioList({ usuarios, onEdit, onDelete, deletingId }: Props) {
  return (
    <div className="usuario-list">
      <h2>Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol}</td>
              <td>
                <button onClick={() => onEdit(usuario.id)} disabled={deletingId !== null}>Editar</button>
                <button onClick={() => onDelete(usuario.id)} disabled={deletingId !== null}>
                  {deletingId === usuario.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}