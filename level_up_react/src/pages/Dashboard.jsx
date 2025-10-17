import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/dashboardStyles.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="page">
      <main>
        <div className="row">
          {/* Sidebar */}
          <div className="col-2 sidebar-container">
            <div className="sideBar">
              <a className="sidebarbtn" onClick={() => navigate('/crear')}>
                <strong>Crear Producto</strong>
              </a>
              <a className="sidebarbtn" onClick={() => navigate('/listar')}>
                <strong>Ver Productos</strong>
              </a>
              <a className="sidebarbtn" onClick={() => navigate('/actualizar')}>
                <strong>Actualizar Producto</strong>
              </a>
              <a className="sidebarbtn" onClick={() => navigate('/eliminar')}>
                <strong>Borrar Producto</strong>
              </a>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="col-10 dashboard-main">
            <div className="dashboard-header">
              <h1 className="titulo">Panel de Administración</h1>
              <p>Bienvenido, <strong>{user.name || 'Usuario'}</strong></p>
            </div>
            
            <div className="dashboard-cards">
              <div className="dashboard-card" onClick={() => navigate('/crear')}>
                <i className="fa-solid fa-plus"></i>
                <h3>Crear Producto</h3>
                <p>Agregar nuevos productos al catálogo</p>
              </div>

              <div className="dashboard-card" onClick={() => navigate('/listar')}>
                <i className="fa-solid fa-list"></i>
                <h3>Ver Productos</h3>
                <p>Listar y buscar productos existentes</p>
              </div>

              <div className="dashboard-card" onClick={() => navigate('/actualizar')}>
                <i className="fa-solid fa-pen-to-square"></i>
                <h3>Actualizar Producto</h3>
                <p>Modificar información de productos</p>
              </div>

              <div className="dashboard-card" onClick={() => navigate('/eliminar')}>
                <i className="fa-solid fa-trash"></i>
                <h3>Eliminar Producto</h3>
                <p>Remover productos del catálogo</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;