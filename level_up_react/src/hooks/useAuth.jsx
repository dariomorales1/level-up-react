// hooks/useAuth.js
import { useApp } from '../context/AppContext';

export const useAuth = () => {
    const { user, dispatchUser, cart, dispatchCart } = useApp();

    const login = (userData) => {
        console.log('🔐 useAuth - STARTING LOGIN for user:', userData);
        console.log('🔐 useAuth - Current guest cart before login:', cart.items);
        
        const guestCart = [...cart.items];

        dispatchUser({ type: 'LOGIN', payload: userData });

        setTimeout(() => {
            const userCartKey = `cart_${userData.id}`;
            const savedUserCart = JSON.parse(localStorage.getItem(userCartKey)) || { items: [] };
            
            console.log('🔐 useAuth - Saved user cart from localStorage:', savedUserCart);
            console.log('🔐 useAuth - Guest cart to merge:', guestCart);

            const combinedItems = [...savedUserCart.items];

            guestCart.forEach(guestItem => {
                const existingItem = combinedItems.find(item => item.id === guestItem.id);
                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    combinedItems.push({...guestItem});
                }
            });

            console.log('🔐 useAuth - Combined cart after merge:', combinedItems);

            dispatchCart({
                type: 'SET_USER_CART', 
                payload: {
                    items: combinedItems,
                    userId: userData.id
                }
            });
            
            localStorage.removeItem('guest_cart');
            console.log('🔐 useAuth - LOGIN COMPLETED');
        
        }, 100);
    };

    const logout = () => {
        console.log('🚪 useAuth - STARTING LOGOUT for user:', user);
        
        if (user) {
            const userCartKey = `cart_${user.id}`;
            localStorage.setItem(userCartKey, JSON.stringify({ 
                items: cart.items, 
                userId: user.id 
            }));
            console.log('🚪 useAuth - User cart saved to localStorage:', userCartKey, cart.items);
        }
        
        dispatchUser({ type: 'LOGOUT' });
        
        setTimeout(() => {
            dispatchCart({ 
                type: 'LOAD_CART', 
                payload: { items: [], userId: null }
            });
            console.log('🚪 useAuth - LOGOUT COMPLETED - Guest cart loaded (empty)');
        }, 100);
    };

    const isAuthenticated = !!user;

    return {
        user: user || null,
        login,
        logout,
        isAuthenticated
    };
};