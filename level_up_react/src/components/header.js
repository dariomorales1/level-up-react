import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/headerStyles.css';

export default function Header () {
    const [currentUser, setCurrentUser] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    // Simular funciones de sesión y carrito
    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem("session_user")) || null;
    };

    const logout = () => {
        localStorage.removeItem("session_user");
        setCurrentUser(null);
        // Limpiar carrito al cerrar sesión
        setCartItems([]);
        setCartCount(0);
    };

    const updateCartBadge = () => {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
    };

    const openCart = () => {
        setCartOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeCart = () => {
        setCartOpen(false);
        document.body.style.overflow = "";
    };

    const clearCart = () => {
        setCartItems([]);
        setCartCount(0);
        closeCart();
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        
        // Simular carga del carrito desde localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(savedCart);
        updateCartBadge();
    }, []);

    // Actualizar badge cuando cambien los items del carrito
    useEffect(() => {
        updateCartBadge();
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Cerrar carrito con ESC
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && cartOpen) {
                closeCart();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [cartOpen]);

    // Calcular totales del carrito
    const calculateTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 3990; // CLP
        const total = subtotal + shipping;
        
        return { subtotal, shipping, total };
    };

    const { subtotal, shipping, total } = calculateTotals();

    return (
        <>
            <header className="headerPpal">
                <nav className="navbarPpal">
                    <div className="navbarFirstContainer">
                        <a className="navbar-brand logoName" href="/" id="logo">
                            <img 
                                src="/assets/icons/icono.png" 
                                alt="icono" 
                                width="60" 
                                height="auto" 
                                className="d-inline-block align-text-center" 
                            />
                            Level-Up
                        </a>
                    </div>

                    <div className="navBarButtons">
                        <div className="navBarButtonsContainer">
                            <a className="nav-link active btnAgregarHeader" href="/">
                                Inicio
                            </a>
                            <a className="nav-link active btnAgregarHeader" href="/catalogo">
                                Catalogo
                            </a>
                        </div>

                        <div className="navBarButtonsContainer">
                            {/* Botón Carrito */}
                            <a id="openCart" className="btnCarrito" onClick={openCart} style={{cursor: 'pointer'}}>
                                <i className="fa-solid fa-cart-shopping"></i>
                                <span id="cartCount">{cartCount}</span>
                            </a>

                            {/* Estado de sesión */}
                            {currentUser ? (
                                <>
                                    <a className="nav-link active btnAgregarHeader" href="/cuenta">
                                        {currentUser.name ? `Hola, ${currentUser.name}` : "Cuenta"}
                                    </a>
                                    <a 
                                        id="logoutBtn" 
                                        className="nav-link active btnAgregarHeader" 
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            logout();
                                        }}
                                        style={{cursor: 'pointer'}}
                                    >
                                        Cerrar sesión
                                    </a>
                                </>
                            ) : (
                                <>
                                    <a className="nav-link active btnAgregarHeader" href="/login">
                                        Ingresar
                                    </a>
                                    <a className="nav-link active btnAgregarHeader" href="/register">
                                        Registrarse
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Drawer/Modal del carrito */}
            <div id="cartDrawer" className={`cartDrawer ${cartOpen ? 'show' : ''}`}>
                <div id="left" aria-label="Cerrar carrito (overlay)" onClick={closeCart}></div>
                <div id="right">
                    <div className="rightUp">
                        <h2 id="carritoBtn">
                            <i className="fa-solid fa-cart-shopping"></i> Tu Carrito
                        </h2>
                        
                        <div id="cartItems">
                            {cartItems.length === 0 ? (
                                <p>Tu carrito está vacío</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="cartContainer">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            width="60" 
                                            style={{
                                                backgroundColor: 'white',
                                                objectFit: 'contain',
                                                borderRadius: '5px'
                                            }}
                                        />
                                        <div className="cartInfo">
                                            <div className="itemName">{item.name}</div>
                                            <div className="countPrice">
                                                ${item.price.toLocaleString()} x {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {cartItems.length > 0 && (
                            <>
                                <hr />
                                <p><strong>Subtotal:</strong> <span id="cartSubtotal">${subtotal.toLocaleString()}</span></p>
                                <p><strong>Envío:</strong> <span id="cartEnvio">${shipping.toLocaleString()} CLP</span></p>
                                <p><strong>Total:</strong> <span id="cartTotal">${total.toLocaleString()}</span></p>
                                
                                <div className="btnesUp">
                                    <button id="vaciarCart" className="btnVaciar" onClick={clearCart}>
                                        Vaciar carrito
                                    </button>
                                    <button id="cerrarCarro" className="btnVaciar" onClick={closeCart}>
                                        Cerrar carrito
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {cartItems.length > 0 && (
                        <div className="rightDown">
                            <button id="comprarCarro" className="btnComprar">
                                Pagar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};