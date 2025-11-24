import { createContext, useContext } from 'react';
import { useCart as useCartHook } from '../hooks/useCart';

const CartContext = createContext(null);

// Provider que envuelve la app y comparte UN SOLO carrito
export const CartProvider = ({ children }) => {
  const cart = useCartHook(); // aquí está tu hook grande que ya hicimos

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

// Hook que usarás en los componentes en vez de useCartHook directo
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return ctx;
};
