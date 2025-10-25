import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/components/carritoStyles.css';
import showToast from '../components/toast';

const AddToCart = (e) => {
    e.stopPropagation();
    showToast("Proximamente podrás proceder al pago");
};

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, dispatchCart } = useApp();
    const cartItems = cart?.items || [];

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const clearCart = () => {
        dispatchCart({ type: 'CLEAR_CART' });
    };

    const removeFromCart = (productId) => {
        dispatchCart({ type: 'REMOVE_FROM_CART', payload: productId });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
        removeFromCart(productId);
        return;
        }
        dispatchCart({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity: newQuantity }
        });
    };

    const parseCurrency = (currencyString) => {
        if (!currencyString) return 0;
        
        const numericString = currencyString.replace(/[^\d,.-]/g, '');
        
        // Remover separadores de miles y convertir coma decimal a punto
        const cleanString = numericString
            .replace(/\./g, '')  //remueve puntos (separadores de miles)
            .replace('.', '');  //convierte coma decimal a punto
        
        return parseFloat(cleanString) || 0;
    };

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => {
            const price = parseCurrency(item?.price); //función de conversión
            const quantity = item?.quantity || 0;
            return sum + (price * quantity);
        }, 0);

        const shipping = 3990;
        const total = subtotal + shipping;
        
        return { subtotal, shipping, total };
    };

const { subtotal, shipping, total } = calculateTotals();

    return (
        <div className={`cartDrawer ${isOpen ? 'show' : ''}`}>
        <div className="cartOverlay" onClick={onClose}></div>
        <div className="cartContent">
            <div className="cartHeader">
            <h2>
                <i className="fa-solid fa-cart-shopping"></i> Tu Carrito
            </h2>
            <button className="closeButton" onClick={onClose}>×</button>
            </div>

            <div className="cartBody">
            {cartItems.length === 0 ? (
                <div className="emptyCart">
                <i className="fa-solid fa-cart-arrow-down cart-empty-icon"></i>
                <p>Tu carrito está vacío</p>
                <button className="btnContinueShopping" onClick={onClose}>
                    Seguir Comprando
                </button>
                </div>
            ) : (
                cartItems.map(item => (
                <div key={item.id} className="cartItem">
                    <img 
                    src={item.image} 
                    alt={item.name}
                    className="cartItemImage"
                    />
                    <div className="itemDetails">
                    <div className="itemName">{item.name}</div>
                    <div className="itemPrice">${item.price?.toLocaleString() || '0'}</div>
                    <div className="quantityControls">
                        <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantityBtn"
                        >
                        -
                        </button>
                        <span className="quantityNumber">{item.quantity}</span>
                        <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantityBtn"
                        >
                        +
                        </button>
                    </div>
                    </div>
                    <button 
                    className="removeButton"
                    onClick={() => removeFromCart(item.id)}
                    title="Eliminar producto"
                    >
                    ×
                    </button>
                </div>
                ))
            )}
            </div>

            {cartItems.length > 0 && (
            <div className="cartFooter">
                <div className="cartTotals">
                <div className="totalRow">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="totalRow">
                    <span>Envío:</span>
                    <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="totalRow total">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                </div>
                </div>

                <div className="cartActions">
                <button className="btnSecondary" onClick={clearCart}>
                    <i className="fa-solid fa-trash"></i> Vaciar Carrito
                </button>
                <button className="btnPrimary" onClick={AddToCart}>
                    <i className="fa-solid fa-credit-card"></i> Proceder al Pago
                </button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
};

export default CartDrawer;