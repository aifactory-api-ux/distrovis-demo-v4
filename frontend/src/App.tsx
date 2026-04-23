import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { KPICards } from './components/KPICards';
import { LineChartComponent } from './components/LineChart';
import { BarChartComponent } from './components/BarChart';
import { OrderTable } from './components/OrderTable';
import { OrderForm } from './components/OrderForm';
import { Notification } from './components/Notification';
import { useOrders } from './hooks/useOrders';
import { useKPI } from './hooks/useKPI';
import { usePlants } from './hooks/usePlants';
import { useDistributionCenters } from './hooks/useDistributionCenters';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { CreateOrderRequest } from './types';

const ITEMS_PER_PAGE = 10;

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { user, token, login, logout } = useAuth();
  const { orders, loading: ordersLoading, fetchOrders, createOrder } = useOrders();
  const { kpi, loading: kpiLoading, fetchKPI } = useKPI();
  const { plants, loading: plantsLoading, fetchPlants } = usePlants();
  const { distributionCenters, loading: dcLoading, fetchDistributionCenters } = useDistributionCenters();

  useEffect(() => {
    if (token) {
      fetchPlants();
      fetchDistributionCenters();
    }
  }, [token, fetchPlants, fetchDistributionCenters]);

  useEffect(() => {
    if (token) {
      const params: { plant_id?: string; status?: string } = {};
      if (selectedPlant) params.plant_id = selectedPlant;
      if (selectedStatus) params.status = selectedStatus;
      fetchOrders(params);
      fetchKPI(params);
    }
  }, [token, selectedPlant, selectedStatus, fetchOrders, fetchKPI]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleOrderSubmit = async (data: CreateOrderRequest) => {
    try {
      await createOrder(data);
      setNotification({ message: 'Order created successfully!', type: 'success' });
      const params: { plant_id?: string; status?: string } = {};
      if (selectedPlant) params.plant_id = selectedPlant;
      if (selectedStatus) params.status = selectedStatus;
      fetchOrders(params);
      fetchKPI(params);
    } catch {
      setNotification({ message: 'Failed to create order', type: 'error' });
    }
  };

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">DistroViz Login</h1>
          <LoginForm onSubmit={login} loading={false} error={null} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <Header onThemeToggle={handleThemeToggle} theme={theme} />

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Dashboard
          </h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <Filters
          plants={plants}
          distributionCenters={distributionCenters}
          selectedPlant={selectedPlant}
          selectedStatus={selectedStatus}
          onPlantChange={setSelectedPlant}
          onStatusChange={setSelectedStatus}
        />

        <KPICards kpi={kpi} loading={kpiLoading} error={null} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LineChartComponent />
          <BarChartComponent />
        </div>

        <OrderForm
          plants={plants}
          distributionCenters={distributionCenters}
          onSubmit={handleOrderSubmit}
          loading={ordersLoading}
        />

        <OrderTable
          orders={paginatedOrders}
          loading={ordersLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}