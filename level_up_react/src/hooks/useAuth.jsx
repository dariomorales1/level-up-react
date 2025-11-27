import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const API_BASE_URL = 'http://levelup.ddns.net:8080'; // Gateway (cámbialo a http://localhost:8080 en local si quieres)

// Axios instance para auth / users
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuth = () => {
  const { user, dispatchUser } = useApp();

  // ===========================================
  // 🔹 AUTO-LOGIN SOLO SI isAuthenticated = true
  // ===========================================
  useEffect(() => {
    const saved = localStorage.getItem('authUser');
    if (!saved || user) return;

    try {
      const parsed = JSON.parse(saved);

      if (parsed.isAuthenticated && parsed.user) {
        console.log('Auto-login desde localStorage:', parsed.user);

        dispatchUser({
          type: 'LOGIN',
          payload: parsed.user,
        });
      }
    } catch (e) {
      console.error('Error parseando authUser de localStorage:', e);
    }
  }, [user, dispatchUser]);

  // ===========================================
  // 🔹 FUNCIÓN PARA OBTENER TOKEN DE FIREBASE
  // ===========================================
  window.obtenerTokenFirebase = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.warn('No hay usuario autenticado en Firebase');
      return null;
    }

    const token = await currentUser.getIdToken(true);
    console.log('TOKEN_FIREBASE:', token);
    return token;
  };

  // ===========================================
  // 🔹 apiCall con AXIOS (y refresh en 401)
  // ===========================================
  const apiCall = async (url, options = {}) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('No hay token de acceso disponible');
    }

    const method = options.method || 'GET';
    const data = options.body || undefined;
    const extraHeaders = options.headers || {};

    const doRequest = async (token) => {
      return api.request({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ...extraHeaders,
        },
      });
    };

    try {
      const response = await doRequest(accessToken);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('🔄 Token expirado, intentando refresh...');
        const newToken = await refreshToken();
        if (!newToken) {
          throw new Error('Sesión expirada');
        }
        const response = await doRequest(newToken);
        return response;
      }
      console.error('❌ Error en apiCall:', error);
      throw error;
    }
  };

  // ===========================================
  // 🔹 REFRESH TOKEN (también con axios)
  // ===========================================
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');

      if (!refreshTokenValue) {
        console.warn('No hay refresh token disponible');
        return null;
      }

      const response = await api.post('/auth/refresh', {
        refreshToken: refreshTokenValue,
      });

      const data = response.data;
      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        console.log('✅ Token refrescado exitosamente');
        return data.accessToken;
      } else {
        console.error('❌ Respuesta inválida al refrescar token');
        logout();
        return null;
      }
    } catch (error) {
      console.error('❌ Error en refreshToken:', error);
      logout();
      return null;
    }
  };

  // ===========================================
  // 🔹 LOGIN (solo maneja usuario y tokens)
  // ===========================================
  const login = async (userData, rememberMe = false) => {
    console.log('LOGIN ejecutado - rememberMe:', rememberMe);
    console.log('UserData recibido:', userData);

    try {
      const userWithTokens = {
        id: userData.id,
        name: userData.nombre || userData.name,
        email: userData.email,
        rol: userData.rol || userData.role,
        role: userData.rol || userData.role,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      };

      if (userData.accessToken) {
        localStorage.setItem('accessToken', userData.accessToken);
      }
      if (userData.refreshToken) {
        localStorage.setItem('refreshToken', userData.refreshToken);
      }

      if (rememberMe) {
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            user: userWithTokens,
            isAuthenticated: true,
          }),
        );
      } else {
        localStorage.removeItem('authUser');
      }

      dispatchUser({ type: 'LOGIN', payload: userWithTokens });

      console.log('✅ Login completo exitoso - Usuario:', userWithTokens);
      return true;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  // ===========================================
  // 🔹 FUNCIONES PARA GESTIÓN DE USUARIOS
  // ===========================================
  const obtenerUsuarios = async () => {
    try {
      const response = await apiCall('/users');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  };

  const obtenerUsuarioPorId = async (userId) => {
    try {
      const response = await apiCall(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  };

  const actualizarUsuario = async (userId, datosUsuario) => {
    try {
      const response = await apiCall(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(datosUsuario),
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  const obtenerMiPerfil = async () => {
    try {
      const response = await apiCall('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  };

  // ===========================================
  // 🔹 LOGOUT
  // ===========================================
  const logout = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        await api
          .post('/auth/logout', {
            refreshToken: refreshTokenValue,
          })
          .catch((err) => {
            console.warn('No se pudo notificar logout al backend:', err);
          });
      }
    } catch (error) {
      console.warn('Error en logout del backend:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    const saved = localStorage.getItem('authUser');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.isAuthenticated = false;
        localStorage.setItem('authUser', JSON.stringify(parsed));
      } catch (e) {
        console.error('Error actualizando authUser en logout:', e);
        localStorage.removeItem('authUser');
      }
    }

    dispatchUser({ type: 'LOGOUT' });

    console.log('✅ Logout completo exitoso');
  };

  const isAuthenticated = !!user;

  return {
    user,
    login,
    logout,
    isAuthenticated,
    apiCall,
    refreshToken,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    obtenerMiPerfil,
  };
};
