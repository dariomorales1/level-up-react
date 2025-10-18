// components/Header.js
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

    // ✅ ELIMINAR el estado de carga - dejar que el Context maneje el estado
    console.log('Header - user:', user);
    console.log('Header - isAuthenticated:', isAuthenticated);

    // ✅ Manejar cart de forma segura
    const cartItems = cart?.items || [];
    const cartItemsCount = cartItems.reduce((total, item) => total + (item?.quantity || 0), 0);
    
    const isManagementPage = location.pathname === '/cuenta';

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const handleLogout = () => {
        console.log('Logging out...');
        logout();
        navigate('/');
        closeCart();
    };

    // ✅ NO mostrar loading - mostrar el header siempre, incluso si user es null
    return (
        <>
            <header className="headerPpal">
                <nav className="navbarPpal">
                    <div className="navbarFirstContainer">
                        <a className="navbar-brand logoName" href="/">
                            <img src={image} alt='logo' width='40px' />
                            Level-Up
                        </a>
                    </div>

                    <div className="navBarButtons">
                        {/* Ocultar navegación principal en gestión de productos */}
                        {!isManagementPage && (
                            <div className="navBarButtonsContainer">
                                <NavButton text="Inicio" to="/"/>
                                <NavButton text="Catalogo" to="/catalogo"/>
                            </div>
                        )}

                        <div className="navBarButtonsContainer navBarButtonsContainer--right">
                            {/* Ocultar carrito en gestión de productos */}
                            {!isManagementPage && (
                                <button className="btnCarrito" onClick={openCart}>
                                    <FontAwesomeIcon icon={faCartShopping} className='carritoIcon' />
                                    {cartItemsCount > 0 && (
                                        <span className="cartBadge">{cartItemsCount}</span>
                                    )}
                                </button>
                            )}

                            {/* ✅ Mostrar botones según autenticación - user puede ser null */}
                            {isAuthenticated && user ? (
                                <>
                                    {!isManagementPage && (
                                        <NavButton 
                                            text={user.name ? `Hola, ${user.name}` : "Cuenta"} 
                                            to="/cuenta" 
                                            className="btnAgregarHeader"
                                        />
                                    )}
                                    <button 
                                        className="btnHeader" 
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    {!isManagementPage && (
                                        <>
                                            <NavButton text="Ingresar" to="/login" className="btnHeader"/>
                                            <NavButton text="Registrarse" to="/register" className="btnAgregarHeader"/>
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