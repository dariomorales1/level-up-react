import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import { getAuth } from "firebase/auth";

export const useAuth = () => {
  const { user, dispatchUser } = useApp(); // 👈 ya no usamos cart ni dispatchCart

  // ===========================================
  // 🔹 AUTO-LOGIN SOLO SI isAuthenticated = true
  // ===========================================
  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (!saved || user) return;

    try {
      const parsed = JSON.parse(saved);

      if (parsed.isAuthenticated && parsed.user) {
        console.log("Auto-login desde localStorage:", parsed.user);

        dispatchUser({
          type: "LOGIN",
          payload: parsed.user
        });
      }
    } catch (e) {
      console.error("Error parseando authUser de localStorage:", e);
    }
  }, [user, dispatchUser]);

  // ===========================================
  // 🔹 FUNCIÓN PARA OBTENER TOKEN DE FIREBASE
  // ===========================================
  window.obtenerTokenFirebase = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.warn("No hay usuario autenticado en Firebase");
      return null;
    }

    const token = await currentUser.getIdToken(true);
    console.log("TOKEN_FIREBASE:", token);
    return token;
  };

  // ===========================================
  // 🔹 FUNCIÓN PARA LLAMAR A MICROSERVICIOS CON TOKEN
  // ===========================================
  const apiCall = async (url, options = {}) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('No hay token de acceso disponible');
    }

    const doFetch = (token) => fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      }
    });

    let response = await doFetch(accessToken);

    // Si el token expiró, intentar refresh
    if (response.status === 401) {
      console.log("🔄 Token expirado, intentando refresh...");
      const newToken = await refreshToken();

      if (!newToken) {
        throw new Error('Sesión expirada');
      }

      response = await doFetch(newToken);
    }

    return response;
  };

  // ===========================================
  // 🔹 REFRESH TOKEN
  // ===========================================
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.warn("No hay refresh token disponible");
        return null;
      }

      const response = await fetch('http://levelup.ddns.net:8080/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        console.log("✅ Token refrescado exitosamente");
        return data.accessToken;
      } else {
        console.error("❌ Error refrescando token");
        // Refresh falló, hacer logout
        logout();
        return null;
      }
    } catch (error) {
      console.error("❌ Error en refreshToken:", error);
      logout();
      return null;
    }
  };

  // ===========================================
  // 🔹 LOGIN (solo maneja usuario y tokens)
  // ===========================================
  const login = async (userData, rememberMe = false) => {
    console.log("LOGIN ejecutado - rememberMe:", rememberMe);
    console.log("UserData recibido:", userData);

    try {
      // 1. Aseguramos estructura consistente del user
      const userWithTokens = {
        id: userData.id,
        name: userData.nombre || userData.name,
        email: userData.email,
        rol: userData.rol || userData.role,
        role: userData.rol || userData.role,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      };

      // 2. Guardar tokens en localStorage
      if (userData.accessToken) {
        localStorage.setItem('accessToken', userData.accessToken);
      }
      if (userData.refreshToken) {
        localStorage.setItem('refreshToken', userData.refreshToken);
      }

      // 3. Guardar sesión si rememberMe está activado
      if (rememberMe) {
        localStorage.setItem("authUser", JSON.stringify({
          user: userWithTokens,
          isAuthenticated: true
        }));
      } else {
        // Si no es rememberMe, aseguramos que no quede basura vieja
        localStorage.removeItem("authUser");
      }

      // 4. Actualizar estado global del usuario
      dispatchUser({ type: "LOGIN", payload: userWithTokens });

      console.log("✅ Login completo exitoso - Usuario:", userWithTokens);
      return true;
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  };

  // ===========================================
  // 🔹 FUNCIONES PARA GESTIÓN DE USUARIOS
  // ===========================================
  const obtenerUsuarios = async () => {
    try {
      const response = await apiCall('http://levelup.ddns.net:8080/users');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  };

  const obtenerUsuarioPorId = async (userId) => {
    try {
      const response = await apiCall(`http://levelup.ddns.net:8080/users/${userId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  };

  const actualizarUsuario = async (userId, datosUsuario) => {
    try {
      const response = await apiCall(`http://levelup.ddns.net:8080/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(datosUsuario)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  const obtenerMiPerfil = async () => {
    try {
      const response = await apiCall('http://levelup.ddns.net:8080/users/me');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  };

  // ===========================================
  // 🔹 LOGOUT (limpia usuario y tokens)
  // ===========================================
  const logout = async () => {
    try {
      // Intentar hacer logout en el backend si hay refresh token
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        await fetch('http://levelup.ddns.net:8080/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: refreshTokenValue })
        }).catch(err => {
          console.warn("No se pudo notificar logout al backend:", err);
        });
      }
    } catch (error) {
      console.warn("Error en logout del backend:", error);
    }

    // Limpiar tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Actualizar estado persistente de authUser
    const saved = localStorage.getItem("authUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.isAuthenticated = false;
        localStorage.setItem("authUser", JSON.stringify(parsed));
      } catch (e) {
        console.error("Error actualizando authUser en logout:", e);
        localStorage.removeItem("authUser");
      }
    }

    // Limpiar usuario en contexto
    dispatchUser({ type: "LOGOUT" });

    console.log("✅ Logout completo exitoso");
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
    obtenerMiPerfil
  };
};
