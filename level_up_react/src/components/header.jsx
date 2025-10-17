// components/Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
                <div className="navBarButtonsContainer">
                <NavButton text="Inicio" to="/"/>
                <NavButton text="Catalogo" to="/catalogo"/>
                </div>

                <div className="navBarButtonsContainer">
                {/* Botón Carrito */}
                <button className="btnCarrito" onClick={openCart}>
                    <FontAwesomeIcon icon={faCartShopping} className='carritoIcon' />
                    {cartItemsCount > 0 && (
                    <span className="cartBadge">{cartItemsCount}</span>
                    )}
                </button>

                {/* Estado de sesión */}
                {user ? (
                    <>
                    <NavButton 
                        text={user.name ? `Hola, ${user.name}` : "Cuenta"} 
                        to="/cuenta" 
                        className="btnAgregarHeader"
                    />
                    <button 
                        className="nav-link active btnHeader" 
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                    </>
                ) : (
                    <>
                    <NavButton text="Ingresar" to="/login" className="btnHeader"/>
                    <NavButton text="Registrarse" to="/register" className="btnAgregarHeader"/>
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