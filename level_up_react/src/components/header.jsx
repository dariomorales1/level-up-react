import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import NavButton from './navButton';
import CartDrawer from './carrito';
import '../styles/components/headerStyles.css';
import image from '../assets/icons/icono.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mobileMenuRef = useRef(null);

  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart(); // NUEVO: Usar useCart para el contador
  const navigate = useNavigate();
  const location = useLocation();


  const adminManagementPrefixes = [
    '/PanelAdministrador',
    '/CrearProducto',
    '/actualizar'
  ];

  const isManagementPage = adminManagementPrefixes.some(prefix =>
    location.pathname.startsWith(prefix)
  );

  const openCart = () => {
    setIsCartOpen(true);
    setIsMobileOpen(false);
  };

  const closeCart = () => setIsCartOpen(false);

  const toggleMobileMenu = () => {
    setIsMobileOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
    closeCart();
  };

  const handleAccountClick = () => {
    closeMobileMenu();
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="headerPpal" role="banner">
        <nav className="navbarPpal" role="navigation" aria-label="Main navigation">
          <div className="navbarFirstContainer">
            <a className="navbar-brand logoName" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <img src={image} alt="Level-Up logo" width="40" />
              <span className="logoText">Level-Up</span>
            </a>
          </div>

          <div className="menuDesktop">
            {!isManagementPage && (
              <div className="navBarButtonsContainer">
                <div className="buttonsLeft">
                  <NavButton text="Inicio" to="/" />
                  <NavButton text="Catalogo" to="/catalogo" />
                  <NavButton text="Blog" to="/blog" />
                </div>
              </div>
            )}
          </div>

          <div className="iconsRight">
            <button
              className="accountButton"
              onClick={handleAccountClick}
              aria-label="Cuenta"
              title={isAuthenticated ? (user?.name ? `Ir a ${user.name}` : 'Ir a cuenta') : 'Ingresar'}
            >
              <FontAwesomeIcon icon={faUser} className="accountIcon" />
            </button>

            {isAuthenticated && (
              <button
                className="logoutButton"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            )}

            {!isManagementPage && (
              <button
                className="btnCarrito carritoOutside"
                onClick={openCart}
                aria-label="Abrir carrito"
                title="Carrito"
              >
                <FontAwesomeIcon icon={faCartShopping} className="carritoIcon" />
                {itemCount > 0 && <span className="cartBadge">{itemCount}</span>}
              </button>
            )}

            <button
              className="menuToggle"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileOpen}
              aria-label="Abrir menú"
              title="Menú"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>

          <div
            ref={mobileMenuRef}
            className={`menuMobile ${isMobileOpen ? 'menuMobile--open' : ''}`}
            aria-hidden={!isMobileOpen}
          >
            {!isManagementPage && (
              <div className="menuMobileInner">
                <NavButton text="Inicio" to="/" onClick={closeMobileMenu} />
                <NavButton text="Catalogo" to="/catalogo" onClick={closeMobileMenu} />
                <NavButton text="Blog" to="/blog" onClick={closeMobileMenu} />
                {isAuthenticated ? (
                  <button className="btnAgregarHeader menuMobileBtn" onClick={() => { handleLogout(); }}>
                    Cerrar sesión
                  </button>
                ) : (
                  <>
                    <NavButton text="Ingresar" to="/login" className="btnHeader menuMobileBtn" onClick={closeMobileMenu} />
                    <NavButton text="Registrarse" to="/register" className="btnAgregarHeader menuMobileBtn" onClick={closeMobileMenu} />
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}