import { KPIResponse } from '../types/models';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  kpis: KPIResponse | null;
  loading: boolean;
}

export function Dashboard({ kpis, loading }: DashboardProps) {
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!kpis) {
    return <div>No hay datos de KPIs</div>;
  }

  const plantaChartData = kpis.despachos_por_planta.map((p) => ({
    name: `Planta ${p.planta_id}`,
    despachos: p.total_despachos,
  }));

  const centroChartData = kpis.despachos_por_centro.map((c) => ({
    name: `Centro ${c.centro_id}`,
    despachos: c.total_despachos,
  }));

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total Ordenes</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{kpis.total_ordenes}</p>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total Unidades</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{kpis.total_unidades}</p>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Pendientes</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{kpis.ordenes_pendientes}</p>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Entregadas</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{kpis.ordenes_entregadas}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Despachos por Planta</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plantaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="despachos" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Despachos por Centro</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={centroChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="despachos" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
