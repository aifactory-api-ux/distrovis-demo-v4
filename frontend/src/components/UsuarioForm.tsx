import React, { useState } from 'react';
import { Usuario } from '../types/models';

interface Props {
  onSubmit: (data: Omit<Usuario, 'id'>) => void;
  loading: boolean;
  initialData?: Omit<Usuario, 'id'>;
}

export function UsuarioForm({ onSubmit, loading, initialData }: Props) {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [rol, setRol] = useState(initialData?.rol || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, email, rol });
  };

  return (
    <form onSubmit={handleSubmit} className="usuario-form">
      <h3>{initialData ? 'Editar' : 'Nuevo'} Usuario</h3>
      <div>
        <label>Nombre</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Rol</label>
        <input type="text" value={rol} onChange={(e) => setRol(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}