import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PedidoList } from '../src/components/PedidoList';
import { Pedido } from '../src/types/models';

describe('PedidoList', () => {
  const mockPedidos: Pedido[] = [
    {
      id: 1,
      usuario_id: 1,
      fecha: '2024-01-15',
      estado: 'pendiente',
      total: 1500,
      items: [{ catalogo_id: 1, cantidad: 2, precio_unitario: 750 }],
    },
    {
      id: 2,
      usuario_id: 2,
      fecha: '2024-01-16',
      estado: 'completado',
      total: 2500,
      items: [{ catalogo_id: 2, cantidad: 5, precio_unitario: 500 }],
    },
  ];

  it('renders the pedidos title', () => {
    render(
      <PedidoList
        pedidos={mockPedidos}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );
    expect(screen.getByText('Pedidos')).toBeDefined();
  });

  it('renders pedido items in table', () => {
    render(
      <PedidoList
        pedidos={mockPedidos}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );

    expect(screen.getByText('pendiente')).toBeDefined();
    expect(screen.getByText('completado')).toBeDefined();
  });

  it('renders empty table when pedidos is empty', () => {
    render(
      <PedidoList
        pedidos={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );

    const tbody = document.querySelector('tbody');
    expect(tbody?.children.length).toBe(0);
  });

  it('displays correct item count', () => {
    render(
      <PedidoList
        pedidos={mockPedidos}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );

    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('disables buttons when deletingId is not null', () => {
    render(
      <PedidoList
        pedidos={mockPedidos}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={1}
      />
    );

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});