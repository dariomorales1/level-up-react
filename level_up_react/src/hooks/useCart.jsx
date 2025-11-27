import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import cartService from '../services/cartService';
import showToast from '../components/toast';

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId =
      'guest_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export const useCart = () => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    updatedAt: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('cart_session_id') || null;
  });

  const getToken = useCallback(async () => {
    const currentUser = user;
    if (currentUser && typeof currentUser.getIdToken === 'function') {
      return await currentUser.getIdToken();
    }
    return localStorage.getItem('accessToken');
  }, [user]);

  const transformCartData = useCallback((cartData) => {
    if (!cartData || !cartData.items) {
      return { items: [], totalAmount: 0, updatedAt: null };
    }

    const transformedItems = cartData.items.map((item) => ({
      id: item.productId,
      productId: item.productId,
      name: item.productName,
      price: item.unitPrice,
      quantity: item.quantity,
      image: item.imagenUrl || '/default-product.jpg',
      subtotal: item.unitPrice * item.quantity
    }));

    return {
      items: transformedItems,
      totalAmount: cartData.totalAmount,
      updatedAt: cartData.updatedAt
    };
  }, []);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('loadCart - Estado:', { isAuthenticated, userId, sessionId });

      if (isAuthenticated && userId) {
        try {
          const token = await getToken();
          const cartData = await cartService.getCart(userId, token);
          const transformedCart = transformCartData(cartData);
          setCart(transformedCart);
        } catch (err) {
          if (
            err.message.includes('Cart not found') ||
            err.message.includes('404')
          ) {
            setCart({ items: [], totalAmount: 0, updatedAt: null });
          } else {
            throw err;
          }
        }
      } else {
        try {
          const sid = getOrCreateSessionId();
          if (!sessionId) {
            setSessionId(sid);
          }
          const cartData = await cartService.getGuestCart(sid);
          const transformedCart = transformCartData(cartData);
          setCart(transformedCart);
        } catch (err) {
          if (
            err.message.includes('Guest cart not found') ||
            err.message.includes('404')
          ) {
            setCart({ items: [], totalAmount: 0, updatedAt: null });
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error('loadCart - Error:', err);
      setError(err.message);
      showToast('Error al cargar el carrito', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId, isAuthenticated, sessionId, getToken, transformCartData]);

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated && userId) {
        const token = await getToken();
        await cartService.addToCart(userId, product.id, quantity, token);
      } else {
        const sid = getOrCreateSessionId();
        if (!sessionId) setSessionId(sid);
        await cartService.addToGuestCart(sid, product.id, quantity);
      }

      await loadCart();
      showToast('Producto agregado al carrito', 'success');
      return true;
    } catch (err) {
      console.error('addToCart - Error:', err);
      setError(err.message);

      let errorMessage = 'Error al agregar al carrito';
      if (err.message.includes('available')) {
        errorMessage = 'Producto no disponible en la cantidad solicitada';
      } else if (err.message.includes('not found')) {
        errorMessage = 'Producto no encontrado';
      } else if (
        err.message.includes('401') ||
        err.message.includes('No autorizado')
      ) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (err.message.includes('400')) {
        errorMessage = 'Error en la solicitud. Verifica los datos.';
      }

      showToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated && userId) {
        const token = await getToken();
        await cartService.updateQuantity(userId, productId, newQuantity, token);
      } else {
        const sid = getOrCreateSessionId();
        if (!sessionId) setSessionId(sid);
        await cartService.updateGuestQuantity(sid, productId, newQuantity);
      }

      await loadCart();
      showToast('Cantidad actualizada', 'success');
      return true;
    } catch (err) {
      console.error('updateQuantity - Error:', err);
      setError(err.message);
      showToast('Error al actualizar cantidad', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };


  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated && userId) {
        const token = await getToken();
        await cartService.removeFromCart(userId, productId, token);
      } else {
        const sid = getOrCreateSessionId();
        if (!sessionId) setSessionId(sid);
        await cartService.removeFromGuestCart(sid, productId);
      }

      await loadCart();
      showToast('Producto eliminado del carrito', 'success');
      return true;
    } catch (err) {
      console.error('removeFromCart - Error:', err);
      setError(err.message);
      showToast('Error al eliminar del carrito', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };


  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('clearCart - Iniciando');

      if (isAuthenticated && userId) {
        const token = await getToken();
        await cartService.clearCart(userId, token);
      } else {
        const sid = getOrCreateSessionId();
        if (!sessionId) setSessionId(sid);
        await cartService.clearGuestCart(sid);
      }

      setCart({ items: [], totalAmount: 0, updatedAt: null });

      showToast('Carrito vaciado', 'success');
      return true;
    } catch (err) {
      console.error('clearCart - Error:', err);
      setError(err.message);
      showToast('Error al vaciar carrito', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const migrateGuestCart = async () => {
      if (isAuthenticated && userId) {
        const sid = localStorage.getItem('cart_session_id');

        if (sid) {
          try {
            console.log('migrateGuestCart - Iniciando migración:', {
              sessionId: sid,
              userId
            });
            setLoading(true);
            const token = await getToken();

            await cartService.migrateGuestToUser(sid, userId, token);

            localStorage.removeItem('cart_session_id');
            setSessionId(null);

            await loadCart();

            console.log('migrateGuestCart - Migración completada');
            showToast('Carrito transferido correctamente', 'success');
          } catch (err) {
            console.error('migrateGuestCart - Error:', err);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    migrateGuestCart();
  }, [isAuthenticated, userId, getToken, loadCart]);


  useEffect(() => {
    console.log('useEffect - loadCart por cambio de auth/session', {
      isAuthenticated,
      userId,
      sessionId
    });
    loadCart();
  }, [isAuthenticated, userId, sessionId, loadCart]);


  const getTotalItems = useCallback(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  const isInCart = useCallback(
    (productId) => {
      return cart.items.some((item) => item.productId === productId);
    },
    [cart.items]
  );

  const getProductQuantity = useCallback(
    (productId) => {
      const item = cart.items.find((item) => item.productId === productId);
      return item ? item.quantity : 0;
    },
    [cart.items]
  );

  const calculateSubtotal = useCallback(() => {
    return cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart.items]);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);


  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    reloadCart: loadCart,
    getTotalItems,
    isInCart,
    getProductQuantity,
    calculateSubtotal,
    items: cart.items,
    totalAmount: cart.totalAmount,
    itemCount: getTotalItems(),
    isEmpty: cart.items.length === 0,
    isAuthenticated,
    sessionId,
    userId
  };
};
