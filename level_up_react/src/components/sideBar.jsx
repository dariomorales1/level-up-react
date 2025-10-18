import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/components/sideBarStyles.css';

const SideBar = ({ currentView, onViewChange }) => {
    const { user } = useApp();
    
    const adminMenu = [
        { key: 'listas', label: 'Ver Productos', description: 'Gestionar productos del catálogo' },
        { key: 'crear', label: 'Crear Producto', description: 'Agregar nuevos productos' },
    ];

    const customerMenu = [
        { key: 'perfil', label: 'Mi Perfil', description: 'Editar información personal', to: '/cuenta' },
        { key: 'ordenes', label: 'Historial de Compras', description: 'Ver mis pedidos anteriores', to: '/PanelAdministrador' },
        { key: 'direcciones', label: 'Mis Direcciones', description: 'Gestionar direcciones de envío', to: '/PanelAdministrador' }
    ];

    const menuItems = user?.role === 'admin' ? adminMenu : customerMenu;
    const panelTitle = user?.role === 'admin' ? 'PANEL DE ADMINISTRACIÓN' : 'MI CUENTA';
    const userRole = user?.role === 'admin' ? 'Administrador' : 'Cliente';

    const navigate = useNavigate();

    return (
        <aside className="sideBar">
            <div className="admin-section">
                <h2>{panelTitle}</h2>
                <p className="welcome-text">
                    Bienvenido, <span className="user-name">{user?.name || 'Usuario'}</span>
                </p>
                <p className="user-role">({userRole})</p>
            </div>
            
            <div className="menu-items">
                {menuItems.map((item) => (
                    <div 
                        key={item.key}
                        className={`menu-item ${currentView === item.key ? 'active' : ''}`}
                        onClick={() => {
                            if (item.to) {
                                navigate(item.to);
                            } else if (typeof onViewChange === 'function') {
                                onViewChange(item.key);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                if (item.to) navigate(item.to);
                                else if (typeof onViewChange === 'function') onViewChange(item.key);
                            }
                        }}
                    >
                        <h3 className="menu-title">{item.label}</h3>
                        <p className="menu-description">{item.description}</p>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SideBar;