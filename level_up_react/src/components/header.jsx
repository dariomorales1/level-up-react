import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import NavButton from './navButton';
import CartDrawer from './carrito';
import '../styles/components/headerStyles.css';
import image from '../assets/icons/icono.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mobileMenuRef = useRef(null);

  const { cart } = useApp();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cart?.items?.reduce(
    (total, item) => total + (item?.quantity || 0),
    0
  ) || 0;

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

  // Cerrar menú móvil al hacer clic fuera
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
    // Cierra el menú móvil automáticamente al cambiar de ruta
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="headerPpal" role="banner">
        <nav className="navbarPpal" role="navigation" aria-label="Main navigation">
          {/* Left: Logo */}
          <div className="navbarFirstContainer">
            <a className="navbar-brand logoName" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <img src={image} alt="Level-Up logo" width="40" />
              <span className="logoText">Level-Up</span>
            </a>
          </div>

          {/* Center: Desktop Menu */}
          <div className="menuDesktop">
            {!isManagementPage && (
              <div className="navBarButtonsContainer">
                <div className="buttonsLeft">
                  <NavButton text="Inicio" to="/" />
                  <NavButton text="Catalogo" to="/catalogo" />
                  <NavButton text="Blog" to="/blog" />
                </div>
                <div className="buttonsRight">
                  {isAuthenticated ? (
                    <button className="btnAgregar menuMobileBtn" onClick={() => { handleLogout(); }}>
                      Cerrar sesión
                    </button>
                  ) : (
                    <>
                    </>
                )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Icons (Account, Cart, Mobile toggle) */}
          <div className="iconsRight">
            <button
              className="accountButton"
              onClick={handleAccountClick}
              aria-label="Cuenta"
              title={isAuthenticated ? (user?.name ? `Ir a ${user.name}` : 'Ir a cuenta') : 'Ingresar'}
            >
              <FontAwesomeIcon icon={faUser} className="accountIcon" />
            </button>

            {!isManagementPage && (
              <button
                className="btnCarrito carritoOutside"
                onClick={openCart}
                aria-label="Abrir carrito"
                title="Carrito"
              >
                <FontAwesomeIcon icon={faCartShopping} className="carritoIcon" />
                {cartItemsCount > 0 && <span className="cartBadge">{cartItemsCount}</span>}
              </button>
            )}

            {/* Mobile hamburger — only visible in mobile via CSS */}
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

          {/* Mobile dropdown (visible only on mobile by CSS). Clicking links closes it. */}
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
                {/* Auth actions in mobile menu */}
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
