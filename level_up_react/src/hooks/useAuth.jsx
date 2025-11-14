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

    window.obtenerTokenFirebase = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.warn("No hay usuario autenticado");
            return;
        }

        const token = await user.getIdToken(true);
        console.log("TOKEN_FIREBASE:", token);
        return token;
    };

    // ===========================================
    // 🔹 LOGIN (opcionalmente guardar sesión)
    // ===========================================
    const login = (userData, rememberMe = false) => {
        console.log("LOGIN ejecutado - rememberMe:", rememberMe);

        if (rememberMe) {
            localStorage.setItem("authUser", JSON.stringify({
                user: userData,
                isAuthenticated: true
            }));
        }

        const guestCart = [...cart.items];
        const userCartKey = `cart_${userData.id}`;
        const savedUserCartData = JSON.parse(localStorage.getItem(userCartKey));

        let savedUserItems = [];
        if (savedUserCartData?.items) {
            savedUserItems = savedUserCartData.items;
        }

        dispatchUser({ type: "LOGIN", payload: userData });

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
    };

    // ===========================================
    // 🔹 LOGOUT (NO BORRAMOS EL USER COMPLETO)
    // Solo marcamos isAuthenticated = false
    // ===========================================
    const logout = () => {
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
            parsed.isAuthenticated = false;   // 🟦 solo cerramos sesión
            localStorage.setItem("authUser", JSON.stringify(parsed));
        }

        dispatchUser({ type: "LOGOUT" });
        dispatchCart({
            type: "LOAD_CART",
            payload: { items: [], userId: null }
        });
    };

    const isAuthenticated = !!user;

    return { user, login, logout, isAuthenticated };

    
};
