import React, { useState } from 'react';
import { Plant, DistributionCenter, CreateOrderRequest } from '../types';

interface OrderFormProps {
  plants: Plant[];
  distributionCenters: DistributionCenter[];
  onSubmit: (data: CreateOrderRequest) => Promise<void>;
  loading: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  plants,
  distributionCenters,
  onSubmit,
  loading,
}) => {
  const [plantId, setPlantId] = useState('');
  const [centerId, setCenterId] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!plantId) newErrors.plantId = 'Plant is required';
    if (!centerId) newErrors.centerId = 'Distribution center is required';
    if (!productName.trim()) newErrors.productName = 'Product name is required';
    if (quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (unitPrice < 0) newErrors.unitPrice = 'Unit price cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    const orderData: CreateOrderRequest = {
      plant_id: plantId,
      distribution_center_id: centerId,
      items: [
        {
          product_name: productName,
          quantity,
          unit_price: unitPrice,
        },
      ],
    };

    try {
      await onSubmit(orderData);
      setSuccessMessage('Order created successfully!');
      setPlantId('');
      setCenterId('');
      setProductName('');
      setQuantity(1);
      setUnitPrice(0);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrors({ submit: 'Failed to create order. Please try again.' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Order</h3>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plant</label>
            <select
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.plantId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a plant</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
            {errors.plantId && <p className="mt-1 text-sm text-red-500">{errors.plantId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distribution Center
            </label>
            <select
              value={centerId}
              onChange={(e) => setCenterId(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.centerId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a center</option>
              {distributionCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            {errors.centerId && <p className="mt-1 text-sm text-red-500">{errors.centerId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.productName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-500">{errors.productName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.unitPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              step="0.01"
            />
            {errors.unitPrice && <p className="mt-1 text-sm text-red-500">{errors.unitPrice}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>
    </div>
  );
};