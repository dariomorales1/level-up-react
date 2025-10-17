// contexts/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Estado inicial del carrito
const initialCartState = {
    items: []
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
        return { ...state, items: [] };
        
        case 'LOAD_CART':
        return { 
            ...state, 
            items: action.payload.items || [] 
        };
        
        default:
        return state;
    }
    };

    export const AppProvider = ({ children }) => {
    const [cart, dispatchCart] = useReducer(cartReducer, initialCartState);
    const [user, dispatchUser] = useReducer(userReducer, null);

    // Cargar desde localStorage al inicializar
    useEffect(() => {
        try {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || initialCartState;
        const savedUser = JSON.parse(localStorage.getItem('session_user')) || null;
        
        if (savedCart && savedCart.items) {
            dispatchCart({ type: 'LOAD_CART', payload: savedCart });
        }
        if (savedUser) {
            dispatchUser({ type: 'LOAD_USER', payload: savedUser });
        }
        } catch (error) {
        console.error('Error loading from localStorage:', error);
        }
    }, []);

    // Persistir carrito en localStorage
    useEffect(() => {
        try {
        localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
        console.error('Error saving cart to localStorage:', error);
        }
    }, [cart]);

    // Persistir usuario en localStorage
    useEffect(() => {
        try {
        localStorage.setItem('session_user', JSON.stringify(user));
        } catch (error) {
        console.error('Error saving user to localStorage:', error);
        }
    }, [user]);

    const value = {
        cart: cart || initialCartState, // Asegurar que nunca sea undefined
        user,
        dispatchCart,
        dispatchUser
    };

    return (
        <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
    );
};

// Reducer para usuario (agregar esta función)
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

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp debe ser usado dentro de AppProvider');
    }
    return context;
};