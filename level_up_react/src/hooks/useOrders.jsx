import axios from 'axios';
import { useApp } from '../context/AppContext';
import { useAuth } from './useAuth';

// Puedes sobreescribir esto con VITE_ORDER_SERVICE_URL en .env
const ORDER_API_BASE_URL = 'http://localhost:8080';

const orderApi = axios.create({
    baseURL: ORDER_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

    export const useOrders = () => {
    const { user, setUserOrders, setUserPoints } = useApp();
    const { refreshToken } = useAuth();

    const apiCallOrder = async (url, options = {}) => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
        throw new Error('No hay token de acceso disponible');
        }

        const method = options.method || 'GET';
        const data = options.body || undefined;
        const extraHeaders = options.headers || {};

        const doRequest = async (token) =>
        orderApi.request({
            url,
            method,
            data,
            headers: {
            Authorization: `Bearer ${token}`,
            ...extraHeaders,
            },
        });

        try {
        const response = await doRequest(accessToken);
        return response;
        } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('🔄 Token expirado (orders), intentando refresh...');
            const newToken = await refreshToken();
            if (!newToken) {
            throw new Error('Sesión expirada');
            }
            const response = await doRequest(newToken);
            return response;
        }
        console.error('❌ Error en apiCallOrder:', error);
        throw error;
        }
    };

    async function obtenerOrdenesUsuario(userId) {
        const response = await apiCallOrder(`/orders/user/${userId}`);
        const data = response.data || [];
        setUserOrders(data);
        if (userId) {
        localStorage.setItem(`orders_${userId}`, JSON.stringify(data));
        }
        return data;
    }

    async function obtenerPuntosUsuario(userId) {
        const response = await apiCallOrder(`/orders/user/${userId}/points`);
        const data = response.data; // { userId, totalPoints }
        const puntos = data?.totalPoints ?? 0;
        setUserPoints(puntos);
        if (userId) {
        localStorage.setItem(`points_${userId}`, String(puntos));
        }
        return data;
    }

    async function cargarOrdenesYPoints(userIdParam) {
        const id = userIdParam || user?.id;
        if (!id) return;
        await Promise.all([obtenerOrdenesUsuario(id), obtenerPuntosUsuario(id)]);
    }

    async function crearOrdenDesdeCarrito(userId, { usePointsDiscount = false } = {}) {
        const response = await apiCallOrder(
        `/orders/user/${userId}?usePointsDiscount=${usePointsDiscount}`,
        {
            method: 'POST',
        }
        );
        const data = response.data;

        if (data && typeof data.pointsAfter === 'number') {
        setUserPoints(data.pointsAfter);
        localStorage.setItem(`points_${userId}`, String(data.pointsAfter));
        }

        await cargarOrdenesYPoints(userId);

        return data;
    }

    return {
        crearOrdenDesdeCarrito,
        obtenerOrdenesUsuario,
        obtenerPuntosUsuario,
        cargarOrdenesYPoints,
    };
};
