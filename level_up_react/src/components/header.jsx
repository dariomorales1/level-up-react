// components/Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import NavButton from '../components/navButton';
import CartDrawer from '../components/carrito';
import '../styles/components/headerStyles.css';
import image from '../assets/icons/icono.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart } = useApp();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isUserLoaded, setIsUserLoaded] = useState(false); // ← Estado local

    // Esperar a que el usuario se cargue desde localStorage
    useEffect(() => {
    // Mejor condición - esperar a que el contexto termine de cargar
    if (user !== undefined) {
        setIsUserLoaded(true);
    }
}, [user]);

    console.log('Header Debug - user:', user);
    console.log('Header Debug - isUserLoaded:', isUserLoaded);
    console.log('Header Debug - localStorage user:', localStorage.getItem('currentUser'));

    const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    const isManagementPage = location.pathname === '/cuenta'; // ← Cambiar a /cuenta

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isUserLoaded) {
        return (
            <header className="headerPpal">
                <nav className="navbarPpal">
                    <div className="navbarFirstContainer">
                        <a className="navbar-brand logoName" href="/">
                            <img src={image} alt='logo' width='40px' />
                            Level-Up
                        </a>
                    </div>
                    <div>Cargando...</div>
                </nav>
            </header>
        );
    }

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

                {/* Estado de sesión */}
                {user ? (
                    <>
                    {/* Ocultar "Hola, [nombre]" en gestión de productos */}
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
                    {/* Ocultar login/registro en gestión de productos */}
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