import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ErrorBanner } from './components/ErrorBanner';
import { KPICards } from './components/KPICards';
import { TrendChart } from './components/TrendChart';
import { VolumeByPlantChart } from './components/VolumeByPlantChart';
import { CatalogoList } from './components/CatalogoList';
import { CatalogoForm } from './components/CatalogoForm';
import { PedidoList } from './components/PedidoList';
import { PedidoForm } from './components/PedidoForm';
import { UsuarioList } from './components/UsuarioList';
import { UsuarioForm } from './components/UsuarioForm';
import { NotificacionList } from './components/NotificacionList';
import { NotificacionForm } from './components/NotificacionForm';
import { useCatalogo } from './hooks/useCatalogo';
import { usePedidos } from './hooks/usePedidos';
import { useUsuarios } from './hooks/useUsuarios';
import { useNotificaciones } from './hooks/useNotificaciones';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'catalogo' | 'pedidos' | 'usuarios' | 'notificaciones'>('pedidos');

  const { catalogo, loading: catalogoLoading, error: catalogoError, createCatalogo, updateCatalogo, deleteCatalogo } = useCatalogo();
  const { pedidos, loading: pedidosLoading, error: pedidosError, createPedido, updatePedido, deletePedido } = usePedidos();
  const { usuarios, loading: usuariosLoading, error: usuariosError, createUsuario, updateUsuario, deleteUsuario } = useUsuarios();
  const { notificaciones, loading: notificacionesLoading, error: notificacionesError, createNotificacion, deleteNotificacion } = useNotificaciones();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const hasError = catalogoError || pedidosError || usuariosError || notificacionesError;
  const retryFetch = () => {
    window.location.reload();
  };

  const totalUnits = pedidos.reduce((acc, p) => acc + p.items.reduce((a, i) => a + i.cantidad, 0), 0);
  const completedOrders = pedidos.filter(p => p.estado === 'completado').length;
  const avgDeliveryDays = 3.5;
  const fulfillmentRate = pedidos.length > 0 ? (completedOrders / pedidos.length) * 100 : 0;

  const trendData = [
    { month: 'Ene', units: Math.floor(Math.random() * 1000) + 500 },
    { month: 'Feb', units: Math.floor(Math.random() * 1000) + 500 },
    { month: 'Mar', units: Math.floor(Math.random() * 1000) + 500 },
    { month: 'Abr', units: Math.floor(Math.random() * 1000) + 500 },
    { month: 'May', units: Math.floor(Math.random() * 1000) + 500 },
    { month: 'Jun', units: Math.floor(Math.random() * 1000) + 500 },
  ];

  const volumeData = [
    { plant: 'Planta A', volume: Math.floor(Math.random() * 500) + 200 },
    { plant: 'Planta B', volume: Math.floor(Math.random() * 500) + 200 },
    { plant: 'Planta C', volume: Math.floor(Math.random() * 500) + 200 },
    { plant: 'Planta D', volume: Math.floor(Math.random() * 500) + 200 },
  ];

  return (
    <div className={`app ${theme}`}>
      <Header onToggleTheme={toggleTheme} theme={theme} />

      {hasError && <ErrorBanner message="Error al cargar datos" onRetry={retryFetch} />}

      <main className="main-content">
        <KPICards
          totalUnits={totalUnits}
          completedOrders={completedOrders}
          avgDeliveryDays={avgDeliveryDays}
          fulfillmentRate={fulfillmentRate}
        />

        <div className="charts">
          <TrendChart data={trendData} />
          <VolumeByPlantChart data={volumeData} />
        </div>

        <div className="tabs">
          <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? 'active' : ''}>Catálogo</button>
          <button onClick={() => setActiveTab('pedidos')} className={activeTab === 'pedidos' ? 'active' : ''}>Pedidos</button>
          <button onClick={() => setActiveTab('usuarios')} className={activeTab === 'usuarios' ? 'active' : ''}>Usuarios</button>
          <button onClick={() => setActiveTab('notificaciones')} className={activeTab === 'notificaciones' ? 'active' : ''}>Notificaciones</button>
        </div>

        <div className="tab-content">
          {activeTab === 'catalogo' && (
            <>
              <CatalogoList catalogo={catalogo} onEdit={() => {}} onDelete={deleteCatalogo} deletingId={null} />
              <CatalogoForm onSubmit={createCatalogo} loading={catalogoLoading} />
            </>
          )}
          {activeTab === 'pedidos' && (
            <>
              <PedidoList pedidos={pedidos} onEdit={() => {}} onDelete={deletePedido} deletingId={null} />
              <PedidoForm onSubmit={createPedido} loading={pedidosLoading} />
            </>
          )}
          {activeTab === 'usuarios' && (
            <>
              <UsuarioList usuarios={usuarios} onEdit={() => {}} onDelete={deleteUsuario} deletingId={null} />
              <UsuarioForm onSubmit={createUsuario} loading={usuariosLoading} />
            </>
          )}
          {activeTab === 'notificaciones' && (
            <>
              <NotificacionList notificaciones={notificaciones} onDelete={deleteNotificacion} deletingId={null} />
              <NotificacionForm onSubmit={createNotificacion} loading={notificacionesLoading} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}