import React from 'react';
import { useApp } from '../context/AppContext';
import '../styles/components/sideBarStyles.css';

const SideBar = ({ currentView, onViewChange }) => {
    const { user } = useApp();
    
    const adminMenu = [
        { key: 'list', label: 'Ver Productos', description: 'Gestionar productos del catálogo' },
        { key: 'create', label: 'Crear Producto', description: 'Agregar nuevos productos' },
        { key: 'update', label: 'Actualizar Producto', description: 'Modificar información de productos' },
        { key: 'delete', label: 'Eliminar Producto', description: 'Eliminar productos del catálogo' }
    ];

    const customerMenu = [
        { key: 'profile', label: 'Mi Perfil', description: 'Editar información personal' },
        { key: 'orders', label: 'Historial de Compras', description: 'Ver mis pedidos anteriores' },
        { key: 'addresses', label: 'Mis Direcciones', description: 'Gestionar direcciones de envío' }
    ];

    const menuItems = user?.role === 'admin' ? adminMenu : customerMenu;
    const panelTitle = user?.role === 'admin' ? 'PANEL DE ADMINISTRACIÓN' : 'MI CUENTA';
    const userRole = user?.role === 'admin' ? 'Administrador' : 'Cliente';

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
                        onClick={() => onViewChange(item.key)}
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