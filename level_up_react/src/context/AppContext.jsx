import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const AppContext = createContext();

// --- USER STATE ---

const userReducer = (state, action) => {
  console.log('UserReducer - Action:', action.type, 'Payload:', action.payload);
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
  const [user, dispatchUser] = useReducer(userReducer, null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadInitialUser = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('session_user')) || null;
        console.log('AppContext - loaded user from localStorage:', savedUser);

        if (savedUser) {
          dispatchUser({ type: 'LOAD_USER', payload: savedUser });
        }
      } catch (error) {
        console.error('AppContext - Error loading user from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialUser();
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('session_user', JSON.stringify(user));
      console.log('AppContext - saved user to session_user:', user);
    } catch (error) {
      console.error('AppContext - Error saving user to localStorage:', error);
    }
  }, [user]);

  const value = {
    user,
    isLoading,
    dispatchUser,
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
