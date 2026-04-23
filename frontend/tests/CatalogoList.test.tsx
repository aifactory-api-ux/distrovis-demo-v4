import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogoList } from '../src/components/CatalogoList';
import { Catalogo } from '../src/types/models';

describe('CatalogoList', () => {
  const mockCatalogo: Catalogo[] = [
    { id: 1, nombre: 'Producto A', descripcion: 'Descripcion A', precio: 100, stock: 10 },
    { id: 2, nombre: 'Producto B', descripcion: 'Descripcion B', precio: 200, stock: 20 },
  ];

  it('renders the catalog title', () => {
    render(
      <CatalogoList
        catalogo={mockCatalogo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );
    expect(screen.getByText('Catálogo')).toBeDefined();
  });

  it('renders catalog items in table', () => {
    render(
      <CatalogoList
        catalogo={mockCatalogo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );

    expect(screen.getByText('Producto A')).toBeDefined();
    expect(screen.getByText('Producto B')).toBeDefined();
  });

  it('renders empty table when catalogo is empty', () => {
    render(
      <CatalogoList
        catalogo={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );

    const tbody = document.querySelector('tbody');
    expect(tbody?.children.length).toBe(0);
  });

  it('calls onEdit with correct id when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(
      <CatalogoList
        catalogo={mockCatalogo}
        onEdit={onEdit}
        onDelete={vi.fn()}
        deletingId={null}
      />
    );

    const editButtons = document.querySelectorAll('button');
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with correct id when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <CatalogoList
        catalogo={mockCatalogo}
        onEdit={vi.fn()}
        onDelete={onDelete}
        deletingId={null}
      />
    );

    const deleteButtons = document.querySelectorAll('button');
    fireEvent.click(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('disables buttons when deletingId is not null', () => {
    render(
      <CatalogoList
        catalogo={mockCatalogo}
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