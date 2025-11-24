import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import '../styles/components/carritoStyles.css';
import showToast from '../components/toast';

const CartDrawer = ({ isOpen, onClose }) => {
  const { 
    cart, 
    loading, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    items,
    totalAmount,
    itemCount,
    isEmpty,
    isAuthenticated
  } = useCart();
  
  const cartItems = items || [];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleProceedToCheckout = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Debes iniciar sesión para proceder al pago', 'warning');
      return;
    }
    showToast('Próximamente podrás proceder al pago');
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveFromCart = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  /**
   * Calcula subtotal, envío y total del carrito.
   */
  const calculateTotals = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { subtotal: 0, shipping: 0, total: 0 };
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const quantity = item?.quantity ?? 0;
      const unitPrice = item?.price ?? 0;
      return sum + unitPrice * quantity;
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
            {itemCount > 0 && ` (${itemCount})`}
            {!isAuthenticated && <span className="guest-badge">Invitado</span>}
          </h2>
          <button className="closeButton" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cartBody">
          {isEmpty ? (
            <div className="emptyCart">
              <i className="fa-solid fa-cart-arrow-down cart-empty-icon"></i>
              <p>Tu carrito está vacío</p>
              <button className="btnContinueShopping" onClick={onClose}>
                Seguir Comprando
              </button>
            </div>
          ) : (
            <>
              {!isAuthenticated && (
                <div className="guestWarning">
                  <i className="fa-solid fa-info-circle"></i>
                  <p>Inicia sesión para guardar tu carrito y proceder al pago</p>
                </div>
              )}
              
              {cartItems.map((item) => (
                <div key={item.id} className="cartItem">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cartItemImage"
                  />
                  <div className="itemDetails">
                    <div className="itemName">{item.name}</div>
                    <div className="itemPrice">
                      ${item.price?.toLocaleString()}
                    </div>
                    <div className="quantityControls">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="quantityBtn"
                        disabled={loading}
                      >
                        -
                      </button>
                      <span className="quantityNumber">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="quantityBtn"
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="removeButton"
                    onClick={() => handleRemoveFromCart(item.id)}
                    title="Eliminar producto"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {!isEmpty && (
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
              <button 
                className="btnSecondary" 
                onClick={handleClearCart}
                disabled={loading}
              >
                <i className="fa-solid fa-trash"></i> 
                {loading ? 'Vaciando...' : 'Vaciar Carrito'}
              </button>
              <button 
                className="btnPrimary" 
                onClick={handleProceedToCheckout}
                disabled={loading}
              >
                <i className="fa-solid fa-credit-card"></i> 
                {isAuthenticated ? 'Proceder al Pago' : 'Iniciar Sesión para Pagar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;