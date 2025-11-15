import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminProductosHome.css';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AdminProductosHome() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main admin-productos-main">
          <div className="admin-productos-container">
            <div className="admin-productos-header">
              <h1>Gestión de productos</h1>
              <p>
                Administra el catálogo de Level-Up. Hola,{' '}
                <strong>{user?.name || 'Administrador'}</strong>.
              </p>
            </div>

            <div className="admin-productos-cards">
              <div
                className="admin-productos-card"
                onClick={() => navigate('/PanelAdministrador')}
              >
                <i className="fa-solid fa-list"></i>
                <h3>Listar productos</h3>
                <p>Ver, editar o eliminar productos existentes.</p>
              </div>

              <div
                className="admin-productos-card"
                onClick={() => navigate('/CrearProducto')}
              >
                <i className="fa-solid fa-plus"></i>
                <h3>Crear producto</h3>
                <p>Agregar nuevos productos al catálogo.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
