// hooks/useAuth.js
import { useApp } from '../context/AppContext';

export const useAuth = () => {
    const { user, dispatchUser, dispatchCart } = useApp();

    const login = (userData) => {
        dispatchUser({ type: 'LOGIN', payload: userData });
    };

    const logout = () => {
        dispatchUser({ type: 'LOGOUT' });
        dispatchCart({ type: 'CLEAR_CART' }); // Limpiar carrito al cerrar sesión
    };

    const isAuthenticated = !!user;

    return {
        user,
        login,
        logout,
        isAuthenticated
    };
};