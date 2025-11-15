import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import { getAuth } from "firebase/auth";

export const useAuth = () => {
    const { user, dispatchUser, cart, dispatchCart } = useApp();

    // ===========================================
    // 🔹 AUTO-LOGIN SOLO SI isAuthenticated = true
    // ===========================================
    useEffect(() => {
        const saved = localStorage.getItem("authUser");
        if (!saved || user) return;

        const parsed = JSON.parse(saved);

        if (parsed.isAuthenticated) {
            console.log("Auto-login desde localStorage:", parsed.user);
            dispatchUser({ type: "LOGIN", payload: parsed.user });

            const savedCart = localStorage.getItem(`cart_${parsed.user.id}`);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                dispatchCart({
                    type: "SET_USER_CART",
                    payload: {
                        items: parsedCart.items || [],
                        userId: parsed.user.id,
                    }
                });
            }
        }
    }, [user, dispatchUser, dispatchCart]);

    // ===========================================
    // 🔹 FUNCIÓN PARA OBTENER TOKEN DE FIREBASE
    // ===========================================
    window.obtenerTokenFirebase = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.warn("No hay usuario autenticado");
            return null;
        }

        const token = await user.getIdToken(true);
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

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                ...options.headers,
            }
        });
        
        // Si el token expiró, intentar refresh
        if (response.status === 401) {
            console.log("🔄 Token expirado, intentando refresh...");
            const newToken = await refreshToken();
            
            if (newToken) {
                // Reintentar request con nuevo token
                return fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`,
                        ...options.headers,
                    }
                });
            } else {
                throw new Error('Sesión expirada');
            }
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
    // 🔹 LOGIN MEJORADO (sin llamada duplicada al backend)
    // ===========================================
    const login = async (userData, rememberMe = false) => {
        console.log("LOGIN ejecutado - rememberMe:", rememberMe);
        console.log("UserData recibido:", userData);

        try {
            // 1. Los tokens y rol YA vienen en userData desde Login.jsx
            const userWithTokens = {
                ...userData,
                // Asegurar que el rol sea consistente
                role: userData.rol || userData.role // Usar 'rol' si existe, sino 'role'
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
            }

            // 4. Manejar el carrito (tu lógica existente)
            const guestCart = [...cart.items];
            const userCartKey = `cart_${userData.id}`;
            const savedUserCartData = JSON.parse(localStorage.getItem(userCartKey));

            let savedUserItems = [];
            if (savedUserCartData?.items) {
                savedUserItems = savedUserCartData.items;
            }

            // 5. Actualizar estado global con usuario y tokens
            dispatchUser({ type: "LOGIN", payload: userWithTokens });

            // 6. Combinar carritos
            const combined = [...savedUserItems];
            guestCart.forEach(item => {
                const exist = combined.find(i => i.id === item.id);
                if (exist) exist.quantity += item.quantity;
                else combined.push({...item});
            });

            dispatchCart({
                type: "SET_USER_CART",
                payload: { items: combined, userId: userData.id }
            });

            localStorage.removeItem("guest_cart");

            console.log("✅ Login completo exitoso - Usuario:", userWithTokens);

        } catch (error) {
            console.error("❌ Error en login:", error);
            throw error;
        }
    };

    // ===========================================
    // 🔹 LOGOUT MEJORADO (limpia tokens también)
    // ===========================================
    const logout = async () => {
        try {
            // Intentar hacer logout en el backend si hay refresh token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await fetch('http://levelup.ddns.net:8080/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken })
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

        // Tu lógica existente de carrito
        if (user) {
            const key = `cart_${user.id}`;
            localStorage.setItem(key, JSON.stringify({
                items: cart.items,
                userId: user.id
            }));
        }

        // Actualizar estado persistente
        const saved = localStorage.getItem("authUser");
        if (saved) {
            const parsed = JSON.parse(saved);
            parsed.isAuthenticated = false;
            localStorage.setItem("authUser", JSON.stringify(parsed));
        }

        dispatchUser({ type: "LOGOUT" });
        dispatchCart({
            type: "LOAD_CART",
            payload: { items: [], userId: null }
        });

        console.log("✅ Logout completo exitoso");
    };

    const isAuthenticated = !!user;

    return { 
        user, 
        login, 
        logout, 
        isAuthenticated,
        apiCall,
        refreshToken
    };
};