import { Usuario } from '../types/models';

interface UsuarioListProps {
  usuarios: Usuario[];
  loading: boolean;
}

export function UsuarioList({ usuarios, loading }: UsuarioListProps) {
  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <div>
      <h2>Usuarios</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {usuarios.map((usuario) => (
          <div key={usuario.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{usuario.nombre}</h3>
            <p style={{ margin: 0, color: '#666' }}>{usuario.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
