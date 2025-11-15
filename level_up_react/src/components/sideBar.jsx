// src/components/SideBar.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/components/sideBarStyles.css';

const SideBar = ({ currentView }) => {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'ADMIN';

  // 🔹 Estado para abrir/cerrar submenus
  const [openSubmenus, setOpenSubmenus] = useState({
    productos: true,
    usuarios: false,
  });

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // ─────────────────────────────────────
  // MENÚ ADMIN (con submenus)
  // ─────────────────────────────────────
  const adminItems = useMemo(
  () => [
    {
      type: 'link',
      key: 'dashboard',
      label: 'Dashboard',
      description: 'Resumen general del panel',
      to: '/dashboard',
    },
    {
      type: 'link',
      key: 'perfil',
      label: 'Mi Perfil',
      description: 'Editar información personal',
      to: '/cuenta',
    },
    {
      type: 'submenu',
      key: 'productos',
      label: 'Productos',
      description: 'Gestión del catálogo',
      children: [
        {
          key: 'productos-panel',
          label: 'Panel de productos',
          description: 'Resumen y accesos rápidos',
          to: '/admin/productos',
        },
        {
          key: 'productos-listar',
          label: 'Listar productos',
          description: 'Ver y administrar productos',
          to: '/PanelAdministrador',
        },
        {
          key: 'productos-crear',
          label: 'Crear producto',
          description: 'Agregar nuevos productos',
          to: '/CrearProducto',
        },
      ],
    },
    {
      type: 'submenu',
      key: 'usuarios',
      label: 'Usuarios',
      description: 'Gestión de usuarios',
      children: [
        {
          key: 'usuarios-panel',
          label: 'Panel de usuarios',
          description: 'Resumen y accesos rápidos',
          to: '/admin/usuarios',
        },
        {
          key: 'usuarios-listar',
          label: 'Listar usuarios',
          description: 'Ver todos los usuarios',
          to: '/AdminUsuariosListado',
        },
        {
          key: 'usuarios-crear',
          label: 'Crear usuario',
          description: 'Agregar un nuevo usuario',
          to: '/AdminUsuariosCrear',
        },
        {
          key: 'usuarios-actualizar',
          label: 'Actualizar usuario',
          description: 'Modificar datos de usuarios',
          to: '/AdminUsuariosActualizar',
        },
        {
          key: 'usuarios-eliminar',
          label: 'Eliminar usuario',
          description: 'Remover usuarios del sistema',
          to: '/AdminUsuariosEliminar',
        },
      ],
    },
  ],
  []
);

  // ─────────────────────────────────────
  // MENÚ USER (cliente)
  // ─────────────────────────────────────
  const userItems = [
    {
      type: 'link',
      key: 'dashboard',
      label: 'Dashboard',
      description: 'Resumen general de tu cuenta',
      to: '/dashboard',
    },
    {
      type: 'link',
      key: 'perfil',
      label: 'Mi Perfil',
      description: 'Editar información personal',
      to: '/cuenta',
    },
    {
      type: 'link',
      key: 'historial',
      label: 'Historial de compras',
      description: 'Ver pedidos anteriores',
      to: '/historial',
    },
    {
      type: 'link',
      key: 'direcciones',
      label: 'Mis direcciones',
      description: 'Gestionar direcciones de envío',
      to: '/direcciones',
    },
  ];

  const menuItems = isAdmin ? adminItems : userItems;

  const handleNavigate = (to) => {
    if (!to) return;
    navigate(to);
  };

  const isItemActive = (item) => {
    if (item.type === 'link') {
      return isPathActive(item.to) || currentView === item.key;
    }
    if (item.type === 'submenu') {
      return item.children?.some((child) => isPathActive(child.to));
    }
    return false;
  };

  return (
    <aside className="sideBar">
      <div className="admin-section">
        <h2>Panel</h2>
        <p className="welcome-text">
          Bienvenido,{' '}
          <span className="user-name">{user?.name || 'Usuario'}</span>
        </p>
        <p className="user-role">
          ({isAdmin ? 'Administrador' : 'Cliente'})
        </p>
      </div>

      <div className="menu-items">
        {menuItems.map((item) => {
          if (item.type === 'link') {
            return (
              <div
                key={item.key}
                className={`menu-item ${isItemActive(item) ? 'active' : ''}`}
                onClick={() => handleNavigate(item.to)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleNavigate(item.to);
                  }
                }}
              >
                <h3 className="menu-title">{item.label}</h3>
                <p className="menu-description">{item.description}</p>
              </div>
            );
          }

          if (item.type === 'submenu') {
            const isOpen = openSubmenus[item.key];
            const isActive = isItemActive(item);

            return (
              <div key={item.key} className="submenu-block">
                <div
                  className={`menu-item menu-item-parent ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => toggleSubmenu(item.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleSubmenu(item.key);
                    }
                  }}
                >
                  <div className="menu-parent-header">
                    <div>
                      <h3 className="menu-title">{item.label}</h3>
                      <p className="menu-description">
                        {item.description}
                      </p>
                    </div>
                    <span className={`submenu-arrow ${isOpen ? 'open' : ''}`}>
                      ▾
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="submenu">
                    {item.children?.map((child) => (
                      <div
                        key={child.key}
                        className={`submenu-item ${
                          isPathActive(child.to) ? 'active' : ''
                        }`}
                        onClick={() => handleNavigate(child.to)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleNavigate(child.to);
                          }
                        }}
                      >
                        <h4 className="submenu-title">{child.label}</h4>
                        <p className="submenu-description">
                          {child.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </aside>
  );
};

export default SideBar;
