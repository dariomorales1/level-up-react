// src/pages/Dashboard.jsx
import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/dashboardStyles.css';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useApp();
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main">
          <div className="perfil-container">
            <div className="perfil-header">
              <h1>Dashboard</h1>
              <p>
                Bienvenido, <strong>{user?.name || 'Usuario'}</strong>
              </p>
            </div>

            <div className="dashboard-cards">

              {isAdmin && (
                <>
                  <div
                    className="dashboard-card"
                    onClick={() => navigate('/cuenta')}
                  >
                    <i className="fa-solid fa-user"></i>
                    <h3>Mi Perfil</h3>
                    <p>Administra tu información personal.</p>
                  </div>

                  <div
                    className="dashboard-card"
                    onClick={() => navigate('/admin/productos')}
                  >
                    <i className="fa-solid fa-box"></i>
                    <h3>Productos</h3>
                    <p>Listado, creación y administración de productos.</p>
                  </div>

                  <div
                    className="dashboard-card"
                    onClick={() => navigate('/admin/usuarios')}
                  >
                    <i className="fa-solid fa-users"></i>
                    <h3>Usuarios</h3>
                    <p>Gestión de cuentas de usuarios del sistema.</p>
                  </div>
                </>
              )}

              {/* SI ES USER */}
              {!isAdmin && (
                <>
                  {/* PERFIL */}
                  <div className="dashboard-card" onClick={() => navigate('/cuenta')}>
                    <i className="fa-solid fa-user"></i>
                    <h3>Mi Perfil</h3>
                    <p>Administra tus datos personales.</p>
                  </div>

                  {/* HISTORIAL */}
                  <div className="dashboard-card" onClick={() => navigate('/historial')}>
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <h3>Historial de Compras</h3>
                    <p>Revisa tus pedidos anteriores.</p>
                  </div>

                  {/* DIRECCIONES */}
                  <div className="dashboard-card" onClick={() => navigate('/direcciones')}>
                    <i className="fa-solid fa-location-dot"></i>
                    <h3>Mis Direcciones</h3>
                    <p>Gestiona tus direcciones de envío.</p>
                  </div>

                  {/* IR A LA TIENDA */}
                  <div className="dashboard-card" onClick={() => navigate('/catalogo')}>
                    <i className="fa-solid fa-store"></i>
                    <h3>Seguir Comprando</h3>
                    <p>Volver al catálogo principal.</p>
                  </div>
                </>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
