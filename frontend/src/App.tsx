import { useKpis } from './hooks/useKpis';
import { useOrdenes } from './hooks/useOrdenes';
import { usePlantas } from './hooks/usePlantas';
import { useCentros } from './hooks/useCentros';
import { useUsuarios } from './hooks/useUsuarios';
import { Dashboard } from './components/Dashboard';
import { OrdenList } from './components/OrdenList';
import { OrdenForm } from './components/OrdenForm';
import { PlantaList } from './components/PlantaList';
import { CentroList } from './components/CentroList';
import { UsuarioList } from './components/UsuarioList';
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ordenes' | 'plantas' | 'centros' | 'usuarios'>('dashboard');
  const { kpis, loading: kpisLoading, refresh: refreshKpis } = useKpis();
  const { ordenes, loading: ordenesLoading, createOrden } = useOrdenes();
  const { plantas, loading: plantasLoading } = usePlantas();
  const { centros, loading: centrosLoading } = useCentros();
  const { usuarios, loading: usuariosLoading } = useUsuarios();

  const handleOrdenSubmit = async (data: any) => {
    await createOrden(data);
    refreshKpis();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{ background: '#1976d2', color: 'white', padding: '1rem' }}>
        <h1 style={{ margin: 0 }}>Distrovis</h1>
      </header>
      <nav style={{ background: '#eee', padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('ordenes')}>Ordenes</button>
        <button onClick={() => setActiveTab('plantas')}>Plantas</button>
        <button onClick={() => setActiveTab('centros')}>Centros</button>
        <button onClick={() => setActiveTab('usuarios')}>Usuarios</button>
      </nav>
      <main style={{ padding: '1rem' }}>
        {activeTab === 'dashboard' && (
          <>
            <Dashboard kpis={kpis} loading={kpisLoading} />
            <div style={{ marginTop: '2rem' }}>
              <h2>Crear Orden</h2>
              <OrdenForm onSubmit={handleOrdenSubmit} loading={ordenesLoading} plantas={plantas} centros={centros} usuarios={usuarios} />
            </div>
            <div style={{ marginTop: '2rem' }}>
              <OrdenList ordenes={ordenes} loading={ordenesLoading} plantas={plantas} />
            </div>
          </>
        )}
        {activeTab === 'ordenes' && <OrdenList ordenes={ordenes} loading={ordenesLoading} plantas={plantas} />}
        {activeTab === 'plantas' && <PlantaList plantas={plantas} loading={plantasLoading} />}
        {activeTab === 'centros' && <CentroList centros={centros} loading={centrosLoading} />}
        {activeTab === 'usuarios' && <UsuarioList usuarios={usuarios} loading={usuariosLoading} />}
      </main>
    </div>
  );
}

export default App;
