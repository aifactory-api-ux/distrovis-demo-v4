import React, { useState } from 'react';
import { Catalogo } from '../types/models';

interface Props {
  onSubmit: (data: Omit<Catalogo, 'id'>) => void;
  loading: boolean;
  initialData?: Omit<Catalogo, 'id'>;
}

export function CatalogoForm({ onSubmit, loading, initialData }: Props) {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || '');
  const [precio, setPrecio] = useState(initialData?.precio || 0);
  const [stock, setStock] = useState(initialData?.stock || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, descripcion, precio, stock });
  };

  return (
    <form onSubmit={handleSubmit} className="catalogo-form">
      <h3>{initialData ? 'Editar' : 'Nuevo'} Producto</h3>
      <div>
        <label>Nombre</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Descripción</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <div>
        <label>Precio</label>
        <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} required />
      </div>
      <div>
        <label>Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value, 10))} required />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}