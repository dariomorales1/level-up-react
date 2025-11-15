import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import NavButton from './navButton';
import CartDrawer from './carrito';
import '../styles/components/headerStyles.css';
import image from '../assets/icons/icono.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useApp();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = cart?.items || [];
  const cartItemsCount = cartItems.reduce(
    (total, item) => total + (item?.quantity || 0),
    0
  );

  // ❗ Páginas "de gestión" SOLO para ADMIN (panel de productos)
  const adminManagementPrefixes = [
    '/PanelAdministrador',
    '/CrearProducto',
    '/actualizar', // ajusta al nombre real de tu ruta de edición
  ];

  const isManagementPage = adminManagementPrefixes.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeCart();
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <>
      <header className="headerPpal">
        <nav className="navbarPpal">
          <div className="navbarFirstContainer">
            <a
              className="navbar-brand logoName"
              href="/"
              onClick={handleLogoClick}
            >
              <img src={image} alt="logo" width="40px" />
              Level-Up
            </a>
          </div>

          <div className="navBarButtons">
            {/* 🔹 Solo ocultamos navegación principal en páginas de gestión ADMIN */}
            {!isManagementPage && (
              <div className="navBarButtonsContainer">
                <NavButton text="Inicio" to="/" />
                <NavButton text="Catalogo" to="/catalogo" />
                <NavButton text="Blog" to="/blog" />
              </div>
            )}

            <div className="navBarButtonsContainer navBarButtonsContainer--right">
              {/* 🔹 Igual con el carrito: se oculta solo en admin */}
              {!isManagementPage && (
                <button className="btnCarrito" onClick={openCart}>
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    className="carritoIcon"
                  />
                  {cartItemsCount > 0 && (
                    <span className="cartBadge">{cartItemsCount}</span>
                  )}
                </button>
              )}

              {/* 🔹 Botones según autenticación */}
              {isAuthenticated && user ? (
                <>
                  {/* El botón "Cuenta" también se oculta solo en páginas admin, 
                      en /cuenta, /historial, /direcciones, /dashboard SÍ se muestra */}
                  {!isManagementPage && (
                    <NavButton
                      text={user.name ? `Hola, ${user.name}` : 'Cuenta'}
                      to="/cuenta"
                      className="btnAgregarHeader"
                    />
                  )}
                  <button className="btnHeader" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  {!isManagementPage && (
                    <>
                      <NavButton
                        text="Ingresar"
                        to="/login"
                        className="btnHeader"
                      />
                      <NavButton
                        text="Registrarse"
                        to="/register"
                        className="btnAgregarHeader"
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
