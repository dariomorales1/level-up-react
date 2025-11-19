import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/components/carritoStyles.css';
import showToast from '../components/toast';

const AddToCart = (e) => {
  e.stopPropagation();
  showToast('Proximamente podrás proceder al pago');
};

/**
 * Convierte un valor de moneda (string o número) a número.
 * Soporta:
 *  - Número directo (ej: 59990)
 *  - String con símbolos/clp (ej: "$59.990 CLP")
 */
function parseCurrency(currencyValue) {
  // Nada → 0
  if (currencyValue == null) return 0;

  // Si ya es número, lo usamos tal cual
  if (typeof currencyValue === 'number') {
    return currencyValue;
  }

  // Si viene como string tipo "59.990 CLP" o "$59.990"
  const cleaned = String(currencyValue).replace(/[^\d]/g, '');
  if (!cleaned) return 0;

  return Number(cleaned);
}

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
      payload: { id: productId, quantity: newQuantity },
    });
  };

  /**
   * Calcula subtotal, envío y total del carrito.
   * Intenta tomar el precio de:
   *  - item.price
   *  - item.precio
   *  - item.product?.precio / item.product?.price (por si guardas un objeto product)
   */
  const calculateTotals = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { subtotal: 0, shipping: 0, total: 0 };
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const quantity = item?.quantity ?? 0;

      const rawPrice =
        item?.price ??
        item?.precio ??
        item?.product?.precio ??
        item?.product?.price ??
        0;

      const unitPrice = parseCurrency(rawPrice);
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
          </h2>
          <button className="closeButton" onClick={onClose}>
            ×
          </button>
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
            cartItems.map((item) => (
              <div key={item.id} className="cartItem">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cartItemImage"
                />
                <div className="itemDetails">
                  <div className="itemName">{item.name}</div>
                  <div className="itemPrice">
                    $
                    {parseCurrency(
                      item.price ??
                        item.precio ??
                        item.product?.precio ??
                        item.product?.price ??
                        0
                    ).toLocaleString()}
                  </div>
                  <div className="quantityControls">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, (item.quantity || 0) - 1)
                      }
                      className="quantityBtn"
                    >
                      -
                    </button>
                    <span className="quantityNumber">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, (item.quantity || 0) + 1)
                      }
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
