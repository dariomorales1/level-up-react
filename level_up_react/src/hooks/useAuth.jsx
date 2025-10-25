import { useApp } from '../context/AppContext';

export const useAuth = () => {
    const { user, dispatchUser, cart, dispatchCart } = useApp();

    const login = (userData) => {
        console.log('useAuth - STARTING LOGIN for user:', userData);
        console.log('useAuth - Current guest cart before login:', cart.items);
        
        const guestCart = [...cart.items];

        
        const userCartKey = `cart_${userData.id}`;
        const savedUserCartData = JSON.parse(localStorage.getItem(userCartKey));
        
        console.log('useAuth - RAW saved user cart data:', savedUserCartData);
        
        
        let savedUserItems = [];
        if (savedUserCartData) {
            if (Array.isArray(savedUserCartData)) {
                savedUserItems = savedUserCartData;
            } else if (savedUserCartData.items && Array.isArray(savedUserCartData.items)) {
                savedUserItems = savedUserCartData.items;
            } else {
                savedUserItems = savedUserCartData.items || [];
            }
        }
        
        console.log('useAuth - Processed saved user items:', savedUserItems);

        
        dispatchUser({ type: 'LOGIN', payload: userData });

        
        const combinedItems = [...savedUserItems];

        guestCart.forEach(guestItem => {
            const existingItem = combinedItems.find(item => item.id === guestItem.id);
            if (existingItem) {
                existingItem.quantity += guestItem.quantity;
            } else {
                combinedItems.push({...guestItem});
            }
        });

        console.log('useAuth - Combined cart after merge:', combinedItems);

        dispatchCart({
            type: 'SET_USER_CART', 
            payload: {
                items: combinedItems,
                userId: userData.id
            }
        });
        
        localStorage.removeItem('guest_cart');
        console.log('useAuth - LOGIN COMPLETED');
    };

    const logout = () => {
        console.log('useAuth - STARTING LOGOUT for user:', user);
        console.log('useAuth - Current user cart before logout:', cart.items);
        
        if (user) {
            const userCartKey = `cart_${user.id}`;
            localStorage.setItem(userCartKey, JSON.stringify({ 
                items: cart.items, 
                userId: user.id 
            }));
            console.log('useAuth - User cart saved to localStorage:', userCartKey, cart.items);
        }
        
        dispatchUser({ type: 'LOGOUT' });
        dispatchCart({ 
            type: 'LOAD_CART', 
            payload: { items: [], userId: null }
        });
        
        console.log('useAuth - LOGOUT COMPLETED');
    };

    const isAuthenticated = !!user;

    return {
        user: user || null,
        login,
        logout,
        isAuthenticated
    };
};