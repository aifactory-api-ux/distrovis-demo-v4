import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filters } from '../src/components/Filters';
import { Plant, DistributionCenter } from '../src/types';

describe('Filters', () => {
  const mockPlants: Plant[] = [
    { id: 'plant-1', name: 'Plant A', location: 'Location A' },
    { id: 'plant-2', name: 'Plant B', location: 'Location B' },
  ];

  const mockCenters: DistributionCenter[] = [
    { id: 'dc-1', name: 'Center A', address: 'Address A' },
    { id: 'dc-2', name: 'Center B', address: 'Address B' },
  ];

  const mockOnPlantChange = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    mockOnPlantChange.mockClear();
    mockOnStatusChange.mockClear();
  });

  it('should render plant select dropdown', () => {
    render(
      <Filters
        plants={mockPlants}
        distributionCenters={mockCenters}
        selectedPlant=""
        selectedStatus=""
        onPlantChange={mockOnPlantChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByLabelText(/plant/i)).toBeInTheDocument();
  });

  it('should render status select dropdown', () => {
    render(
      <Filters
        plants={mockPlants}
        distributionCenters={mockCenters}
        selectedPlant=""
        selectedStatus=""
        onPlantChange={mockOnPlantChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('should call onPlantChange when plant selection changes', async () => {
    render(
      <Filters
        plants={mockPlants}
        distributionCenters={mockCenters}
        selectedPlant=""
        selectedStatus=""
        onPlantChange={mockOnPlantChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const select = screen.getByLabelText(/plant/i);
    await userEvent.selectOptions(select, 'plant-1');

    expect(mockOnPlantChange).toHaveBeenCalledWith('plant-1');
  });

  it('should call onStatusChange when status selection changes', async () => {
    render(
      <Filters
        plants={mockPlants}
        distributionCenters={mockCenters}
        selectedPlant=""
        selectedStatus=""
        onPlantChange={mockOnPlantChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const select = screen.getByLabelText(/status/i);
    await userEvent.selectOptions(select, 'completed');

    expect(mockOnStatusChange).toHaveBeenCalledWith('completed');
  });

  it('should display selected plant value', () => {
    render(
      <Filters
        plants={mockPlants}
        distributionCenters={mockCenters}
        selectedPlant="plant-1"
        selectedStatus=""
        onPlantChange={mockOnPlantChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const select = screen.getByLabelText(/plant/i) as HTMLSelectElement;
    expect(select.value).toBe('plant-1');
  });

  it('should display selected status value', () => {
    render(
      <Filters
        plants={mockPlants}
        distributionCenters={mockCenters}
        selectedPlant=""
        selectedStatus="pending"
        onPlantChange={mockOnPlantChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const select = screen.getByLabelText(/status/i) as HTMLSelectElement;
    expect(select.value).toBe('pending');
  });

  it('should render all status options', () => {
    render(
      <Filters
        plants={mockPlants}
        distributionCenters={mockCenters}
        selectedPlant=""
        selectedStatus=""
        onPlantChange={mockOnPlantChange}
        onStatusChange={mockOnStatusChange}
      />
    );

    const statusSelect = screen.getByLabelText(/status/i);
    const options = statusSelect.querySelectorAll('option');

    expect(options.length).toBe(5);
  });
});