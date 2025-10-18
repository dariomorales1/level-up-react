import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Estado inicial del carrito
const initialCartState = {
    items: [],
    userId: null
};

// Reducer para el carrito
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    )
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };
        
        case 'SET_USER_CART':
            return {
                ...state,
                items: action.payload.items || [],
                userId: action.payload.userId
            };
            
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
            
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
                )
            };
            
        case 'CLEAR_CART':
            return { ...state, items: [], userId: null };
            
        case 'LOAD_CART':
            return { 
                ...state, 
                items: action.payload.items || [],
                userId: action.payload.userId || null
            };
            
        default:
            return state;
    }
};

// Reducer para usuario
const userReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return action.payload;
        case 'LOGOUT':
            return null;
        case 'LOAD_USER':
            return action.payload;
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [cart, dispatchCart] = useReducer(cartReducer, initialCartState);
    const [user, dispatchUser] = useReducer(userReducer, null);
    const [isLoading, setIsLoading] = React.useState(true);

    // ✅ CORREGIDO: Cargar usuario y su carrito al inicializar
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const savedUser = JSON.parse(localStorage.getItem('session_user')) || null;
                console.log('AppContext - loaded user from localStorage:', savedUser);
                
                if (savedUser) {
                    dispatchUser({ type: 'LOAD_USER', payload: savedUser });
                    
                    // ✅ CORREGIDO: Cargar carrito del usuario
                    const userCartKey = `cart_${savedUser.id}`;
                    const savedCart = JSON.parse(localStorage.getItem(userCartKey)) || { items: [] };
                    
                    console.log('AppContext - loaded user cart from:', userCartKey, savedCart);
                    
                    dispatchCart({
                        type: 'SET_USER_CART',
                        payload: {
                            items: savedCart.items || [],
                            userId: savedUser.id
                        }
                    });
                } else {
                    // Cargar carrito de invitado
                    const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || { items: [] };
                    console.log('AppContext - loaded guest cart:', guestCart);
                    
                    dispatchCart({ 
                        type: 'LOAD_CART', 
                        payload: { 
                            items: guestCart.items || [],
                            userId: null
                        } 
                    });
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // ✅ CORREGIDO: Persistir carrito cuando cambia
    useEffect(() => {
        try {
            if (user) {
                // Guardar carrito del usuario
                const userCartKey = `cart_${user.id}`;
                localStorage.setItem(userCartKey, JSON.stringify({
                    items: cart.items,
                    userId: user.id
                }));
                console.log('AppContext - saved user cart to:', userCartKey, cart.items.length, 'items');
            } else {
                // Guardar carrito de invitado
                localStorage.setItem('guest_cart', JSON.stringify({
                    items: cart.items,
                    userId: null
                }));
                console.log('AppContext - saved guest cart:', cart.items.length, 'items');
            }
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cart, user]);

    // ✅ CORREGIDO: Persistir usuario
    useEffect(() => {
        try {
            localStorage.setItem('session_user', JSON.stringify(user));
            console.log('AppContext - saved user to session_user:', user);
        } catch (error) {
            console.error('Error saving user to localStorage:', error);
        }
    }, [user]);

    const value = {
        cart: cart || initialCartState,
        user,
        isLoading,
        dispatchCart,
        dispatchUser
    };

    return (
        <AppContext.Provider value={value}>
            {!isLoading ? children : <div>Cargando aplicación...</div>}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp debe ser usado dentro de AppProvider');
    }
    return context;
};