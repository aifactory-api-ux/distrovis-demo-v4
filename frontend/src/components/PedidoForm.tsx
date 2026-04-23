import React, { useState } from 'react';
import { Pedido, PedidoItem } from '../types/models';

interface Props {
  onSubmit: (data: Omit<Pedido, 'id'>) => void;
  loading: boolean;
  initialData?: Omit<Pedido, 'id'>;
}

export function PedidoForm({ onSubmit, loading, initialData }: Props) {
  const [usuario_id, setUsuarioId] = useState(initialData?.usuario_id || 0);
  const [fecha, setFecha] = useState(initialData?.fecha || '');
  const [estado, setEstado] = useState(initialData?.estado || 'pendiente');
  const [total, setTotal] = useState(initialData?.total || 0);
  const [items, setItems] = useState<PedidoItem[]>(initialData?.items || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ usuario_id, fecha, estado, total, items });
  };

  const addItem = () => {
    setItems([...items, { catalogo_id: 0, cantidad: 1, precio_unitario: 0 }]);
  };

  const updateItem = (index: number, field: keyof PedidoItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <form onSubmit={handleSubmit} className="pedido-form">
      <h3>{initialData ? 'Editar' : 'Nuevo'} Pedido</h3>
      <div>
        <label>Usuario ID</label>
        <input type="number" value={usuario_id} onChange={(e) => setUsuarioId(parseInt(e.target.value, 10))} required />
      </div>
      <div>
        <label>Fecha</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </div>
      <div>
        <label>Estado</label>
        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required />
      </div>
      <div>
        <label>Total</label>
        <input type="number" step="0.01" value={total} onChange={(e) => setTotal(parseFloat(e.target.value))} required />
      </div>
      <div>
        <label>Items</label>
        <button type="button" onClick={addItem}>Agregar Item</button>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <input type="number" placeholder="Catalogo ID" value={item.catalogo_id} onChange={(e) => updateItem(index, 'catalogo_id', parseInt(e.target.value, 10))} required />
            <input type="number" placeholder="Cantidad" value={item.cantidad} onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value, 10))} required />
            <input type="number" step="0.01" placeholder="Precio" value={item.precio_unitario} onChange={(e) => updateItem(index, 'precio_unitario', parseFloat(e.target.value))} required />
          </div>
        ))}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}