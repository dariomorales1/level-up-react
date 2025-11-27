import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosListado.css';
import { useAuth } from '../hooks/useAuth';
import showToast from '../components/toast';

const AdminUsuariosListado = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiCall } = useAuth();

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall('http://levelup.ddns.net:8080/users');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const datos = await response.json();

      console.log('Tipo de datos:', typeof datos);
      console.log('Es array?:', Array.isArray(datos));
      console.log('Número de elementos:', datos.length);
      console.log('Estructura completa:', datos);
      console.log('Primer elemento:', datos[0]);

      if (Array.isArray(datos)) {
        setUsuarios(datos);
      } else {
        setUsuarios([datos]);
      }

    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError(error.message);
      showToast('Error al cargar los usuarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="panel-administrador">
        <div className="management-layout">
          <SideBar />
          <main className="management-main admin-usuarios-main">
            <div className="admin-usuarios-container">
              <div className="loading-container">
                <p>Cargando usuarios...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-administrador">
        <div className="management-layout">
          <SideBar />
          <main className="management-main admin-usuarios-main">
            <div className="admin-usuarios-container">
              <div className="error-container">
                <p>Error: {error}</p>
                <button
                  className="btn btn-primary"
                  onClick={cargarUsuarios}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main admin-usuarios-main">
          <div className="admin-usuarios-container">
            <div className="admin-usuarios-header">
              <h1>Usuarios</h1>
              <p>Listado de usuarios registrados en el sistema.</p>
              <div className="header-actions">
                <button
                  className="btn btn-secondary"
                  onClick={cargarUsuarios}
                  disabled={loading}
                >
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
                <span className="usuarios-count">
                  {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} encontrado{usuarios.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="admin-usuarios-card">
              <div className="usuarios-table-wrapper">
                <div className="usuarios-grid">
                  {usuarios.map((usuario) => (
                    <div key={usuario.id} className="usuario-card" style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#e5e7eb', fontSize: '1.1rem' }}>{usuario.nombre}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{usuario.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            backgroundColor: usuario.rol === 'ADMIN' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                            color: usuario.rol === 'ADMIN' ? '#60a5fa' : '#c084fc'
                          }}>
                            {usuario.rol}
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            backgroundColor: usuario.activo ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: usuario.activo ? '#22c55e' : '#f87171'
                          }}>
                            {usuario.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        ID: {usuario.id.substring(0, 16)}... | Registro: {usuario.creadoEn ? new Date(usuario.creadoEn).toLocaleDateString('es-CL') : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>

                {usuarios.length === 0 && (
                  <div className="empty-state">
                    <p>No se encontraron usuarios</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsuariosListado;