
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { authService } from '../services/seguridad/authService';
import { useAuthPersistence } from '../hooks/useAuthPersistence';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, setUser, loading } = useAuthPersistence();

  // Memoizar funciones para evitar recreaciones en cada render
  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    if (!response.requiere_2fa) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    return response;
  }, [setUser]);

  const verifyPin = useCallback(async (pinData) => {
    const response = await authService.verifyPin(pinData);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    return response;
  }, [setUser]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, [setUser]);

  const isAuthenticated = useCallback(() => {
    const authenticated = !!user;
    console.log('AuthContext - isAuthenticated:', { user, authenticated });
    return authenticated;
  }, [user]);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    verifyPin,
    isAuthenticated
  }), [user, loading, login, logout, verifyPin, isAuthenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

