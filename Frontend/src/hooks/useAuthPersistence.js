import { useState, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../services/seguridad/authService';

export const useAuthPersistence = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoizar la función checkAuthStatus para evitar recreaciones
  const checkAuthStatus = useCallback(() => {
    try {
      const storedUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (storedUser && token) {
        setUser(storedUser);
      } else {
        // Si no hay token o usuario, limpiar localStorage
        authService.logout();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoizar el handler de storage para evitar recreaciones
  const handleStorageChange = useCallback((e) => {
    if (e.key === 'token' || e.key === 'usuario') {
      checkAuthStatus();
    }
  }, [checkAuthStatus]);

  useEffect(() => {
    checkAuthStatus();

    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus, handleStorageChange]);

  // Memoizar el objeto de retorno para evitar recreaciones innecesarias
  const authState = useMemo(() => ({
    user,
    setUser,
    loading
  }), [user, loading]);

  return authState;
};
