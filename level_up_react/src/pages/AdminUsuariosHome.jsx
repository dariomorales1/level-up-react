import SideBar from '../components/SideBar';
import '../styles/pages/panelAdministrador.css';
import '../styles/pages/adminUsuariosHome.css';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AdminUsuariosHome() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="panel-administrador">
      <div className="management-layout">
        <SideBar />

        <main className="management-main admin-usuarios-home-main">
          <div className="admin-usuarios-home-container">
            <div className="admin-usuarios-home-header">
              <h1>Gestión de usuarios</h1>
              <p>
                Administra los usuarios del sistema. Hola,{' '}
                <strong>{user?.name || 'Administrador'}</strong>.
              </p>
            </div>

            <div className="admin-usuarios-home-cards">
              <div
                className="admin-usuarios-home-card"
                onClick={() => navigate('/AdminUsuariosListado')}
              >
                <i className="fa-solid fa-users"></i>
                <h3>Listar usuarios</h3>
                <p>Ver todos los usuarios registrados.</p>
              </div>

              <div
                className="admin-usuarios-home-card"
                onClick={() => navigate('/AdminUsuariosActualizar')}
              >
                <i className="fa-solid fa-user-pen"></i>
                <h3>Actualizar usuario</h3>
                <p>Modificar datos de un usuario existente.</p>
              </div>

              <div
                className="admin-usuarios-home-card"
                onClick={() => navigate('/AdminUsuariosEliminar')}
              >
                <i className="fa-solid fa-user-minus"></i>
                <h3>Eliminar usuario</h3>
                <p>Remover un usuario del sistema.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
