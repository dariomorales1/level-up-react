import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const AppContext = createContext();

const initialCartState = {
    items: [],
    userId: null
};

const cartReducer = (state, action) => {
    console.log('🛒 CartReducer - Action:', action.type, 'Payload:', action.payload);
    
    switch (action.type) {
        case 'ADD_TO_CART':
        console.log('🛒 ADD_TO_CART - Current items:', state.items);
        console.log('🛒 ADD_TO_CART - New product:', action.payload);
        
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
            const newState = {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
            };
            console.log('🛒 ADD_TO_CART - Item exists, updated state:', newState);
            return newState;
        }
        const newState = {
            ...state,
            items: [...state.items, { ...action.payload, quantity: 1 }]
        };
        console.log('🛒 ADD_TO_CART - New item, updated state:', newState);
        return newState;
        case 'SET_USER_CART':
            console.log('🛒 SET_USER_CART - Setting items:', action.payload.items);
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


const userReducer = (state, action) => {
    console.log('👤 UserReducer - Action:', action.type, 'Payload:', action.payload);
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
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const savedUser = JSON.parse(localStorage.getItem('session_user')) || null;
                console.log('🔄 AppContext - loaded user from localStorage:', savedUser);
                
                if (savedUser) {
                    dispatchUser({ type: 'LOAD_USER', payload: savedUser });
                    
                    
                    const userCartKey = `cart_${savedUser.id}`;
                    const savedCartData = JSON.parse(localStorage.getItem(userCartKey));
                    console.log('🔄 AppContext - RAW saved cart data from', userCartKey, ':', savedCartData);
                    
                    
                    let savedItems = [];
                    if (savedCartData) {
                        if (Array.isArray(savedCartData)) {
                            savedItems = savedCartData; 
                        } else if (savedCartData.items && Array.isArray(savedCartData.items)) {
                            savedItems = savedCartData.items; 
                        } else if (Array.isArray(savedCartData)) {
                            savedItems = savedCartData; 
                        }
                    }
                    
                    console.log('🔄 AppContext - Processed saved items:', savedItems);
                    
                    dispatchCart({
                        type: 'SET_USER_CART',
                        payload: {
                            items: savedItems,
                            userId: savedUser.id
                        }
                    });
                } else {
                    
                    const guestCartData = JSON.parse(localStorage.getItem('guest_cart'));
                    console.log('🔄 AppContext - RAW guest cart data:', guestCartData);
                    
                    let guestItems = [];
                    if (guestCartData) {
                        if (Array.isArray(guestCartData)) {
                            guestItems = guestCartData;
                        } else if (guestCartData.items && Array.isArray(guestCartData.items)) {
                            guestItems = guestCartData.items;
                        }
                    }
                    
                    console.log('🔄 AppContext - Processed guest items:', guestItems);
                    
                    dispatchCart({ 
                        type: 'LOAD_CART', 
                        payload: { 
                            items: guestItems,
                            userId: null
                        } 
                    });
                }
            } catch (error) {
                console.error('❌ AppContext - Error loading from localStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    
    useEffect(() => {
        console.log('💾 AppContext - Cart changed, saving... Items:', cart.items);
        try {
            if (user) {
                const userCartKey = `cart_${user.id}`;
                const cartToSave = {
                    items: cart.items,
                    userId: user.id
                };
                localStorage.setItem(userCartKey, JSON.stringify(cartToSave));
                console.log('💾 AppContext - saved USER cart to:', userCartKey, 'with', cart.items.length, 'items');
            } else {
                const guestCartToSave = {
                    items: cart.items,
                    userId: null
                };
                localStorage.setItem('guest_cart', JSON.stringify(guestCartToSave));
                console.log('💾 AppContext - saved GUEST cart with', cart.items.length, 'items');
            }
        } catch (error) {
            console.error('❌ AppContext - Error saving cart to localStorage:', error);
        }
    }, [cart, user]);

    
    useEffect(() => {
        try {
            localStorage.setItem('session_user', JSON.stringify(user));
            console.log('💾 AppContext - saved user to session_user:', user);
        } catch (error) {
            console.error('❌ AppContext - Error saving user to localStorage:', error);
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