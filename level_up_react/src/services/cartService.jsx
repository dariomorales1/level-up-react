import axios from 'axios';

// CORREGIDO: Base URL sin /carts
const CART_BASE_URL = 'http://levelup.ddns.net:8080';

const axiosInstance = axios.create({
    baseURL: CART_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const cartService = {
    // ========= USUARIOS AUTENTICADOS =========
    
    getCart: async (userId, token) => {
        try {
            console.log('🛒 Obteniendo carrito para usuario:', userId);
            console.log('🛒 URL:', `${CART_BASE_URL}/carts/user/${userId}`);
            
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.get(`/carts/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Carrito obtenido:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching cart:', {
                url: `${CART_BASE_URL}/carts/user/${userId}`,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            if (error.response?.status === 404) {
                console.log('🛒 Carrito no encontrado, se creará uno vacío');
                throw new Error('Cart not found');
            }
            
            throw new Error(`Error al obtener carrito: ${error.response?.data?.message || error.message}`);
        }
    },

    addToCart: async (userId, productId, quantity, token) => {
        try {
            console.log('🛒 Agregando al carrito:', { userId, productId, quantity });
            console.log('🛒 URL:', `${CART_BASE_URL}/carts/user/${userId}/items`);
            
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.post(
                `/carts/user/${userId}/items`,
                {
                    productId: productId,
                    quantity: quantity
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('✅ Item agregado al carrito:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error adding to cart:', {
                url: `${CART_BASE_URL}/carts/user/${userId}/items`,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            throw new Error(`Error al agregar al carrito: ${error.response?.data?.message || error.message}`);
        }
    },

    // ========= USUARIOS ANÓNIMOS =========

    getGuestCart: async (sessionId) => {
        try {
            console.log('🛒 Obteniendo carrito guest:', sessionId);
            console.log('🛒 URL:', `${CART_BASE_URL}/carts/guest/${sessionId}`);
            
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.get(`/carts/guest/${sessionId}`);
            console.log('✅ Carrito guest obtenido:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching guest cart:', {
                url: `${CART_BASE_URL}/carts/guest/${sessionId}`,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            if (error.response?.status === 404) {
                console.log('🛒 Carrito guest no encontrado, se creará uno vacío');
                throw new Error('Guest cart not found');
            }
            
            throw new Error(`Error al obtener carrito: ${error.response?.data?.message || error.message}`);
        }
    },

    addToGuestCart: async (sessionId, productId, quantity) => {
        try {
            console.log('🛒 Agregando a carrito guest:', { sessionId, productId, quantity });
            console.log('🛒 URL:', `${CART_BASE_URL}/carts/guest/${sessionId}/items`);
            
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.post(
                `/carts/guest/${sessionId}/items`,
                {
                    productId: productId,
                    quantity: quantity
                }
            );
            console.log('✅ Item agregado a carrito guest:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error adding to guest cart:', {
                url: `${CART_BASE_URL}/carts/guest/${sessionId}/items`,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(`Error al agregar al carrito: ${error.response?.data?.message || error.message}`);
        }
    },

    updateQuantity: async (userId, productId, quantity, token) => {
        try {
            console.log('🛒 Actualizando cantidad:', { userId, productId, quantity });
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.put(
                `/carts/user/${userId}/items/${productId}?quantity=${quantity}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('✅ Cantidad actualizada:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating quantity:', error.response || error.message);
            throw new Error(`Error al actualizar cantidad: ${error.message}`);
        }
    },

    updateGuestQuantity: async (sessionId, productId, quantity) => {
        try {
            console.log('🛒 Actualizando cantidad guest:', { sessionId, productId, quantity });
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.put(
                `/carts/guest/${sessionId}/items/${productId}?quantity=${quantity}`
            );
            console.log('✅ Cantidad guest actualizada:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating guest quantity:', error.response || error.message);
            throw new Error(`Error al actualizar cantidad: ${error.message}`);
        }
    },

    removeFromCart: async (userId, productId, token) => {
        try {
            console.log('🛒 Eliminando del carrito:', { userId, productId });
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.delete(
                `/carts/user/${userId}/items/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('✅ Item eliminado del carrito');
            return response.data;
        } catch (error) {
            console.error('❌ Error removing from cart:', error.response || error.message);
            throw new Error(`Error al eliminar del carrito: ${error.message}`);
        }
    },

    removeFromGuestCart: async (sessionId, productId) => {
        try {
            console.log('🛒 Eliminando de carrito guest:', { sessionId, productId });
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.delete(
                `/carts/guest/${sessionId}/items/${productId}`
            );
            console.log('✅ Item eliminado de carrito guest');
            return response.data;
        } catch (error) {
            console.error('❌ Error removing from guest cart:', error.response || error.message);
            throw new Error(`Error al eliminar del carrito: ${error.message}`);
        }
    },

    clearCart: async (userId, token) => {
        try {
            console.log('🛒 Vaciando carrito para usuario:', userId);
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.delete(
                `/carts/user/${userId}/clear`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('✅ Carrito vaciado');
            return response.data;
        } catch (error) {
            console.error('❌ Error clearing cart:', error.response || error.message);
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    },

    clearGuestCart: async (sessionId) => {
        try {
            console.log('🛒 Vaciando carrito guest:', sessionId);
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.delete(`/carts/guest/${sessionId}/clear`);
            console.log('✅ Carrito guest vaciado');
            return response.data;
        } catch (error) {
            console.error('❌ Error clearing guest cart:', error.response || error.message);
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    },

    migrateGuestToUser: async (sessionId, userId, token) => {
        try {
            console.log('🛒 Migrando carrito:', { sessionId, userId });
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.post(
                `/carts/migrate/${sessionId}/to/${userId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('✅ Carrito migrado:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error migrating cart:', error.response || error.message);
            throw new Error(`Error al migrar carrito: ${error.message}`);
        }
    },

    healthCheck: async () => {
        try {
            // CORREGIDO: Incluir /carts en la ruta
            const response = await axiosInstance.get('/carts/health');
            return response.data;
        } catch (error) {
            console.error('❌ Health check failed:', error.response || error.message);
            throw new Error(`Error de health check: ${error.message}`);
        }
    }
};

export default cartService;