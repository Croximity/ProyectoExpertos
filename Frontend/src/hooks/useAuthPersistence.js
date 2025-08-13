import { useState, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../services/seguridad/authService';

export const useAuthPersistence = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para validar token JWT básicamente
  const isValidToken = (token) => {
    if (!token) return false;
    
    try {
      // Verificar que el token tenga el formato correcto (3 partes separadas por puntos)
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Verificar que no esté expirado (decodificar payload)
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token expirado');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  };

  // Memoizar la función checkAuthStatus para evitar recreaciones
  const checkAuthStatus = useCallback(() => {
    try {
      const storedUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      console.log('🔍 useAuthPersistence - checkAuthStatus:', {
        storedUser,
        token: token ? 'Presente' : 'Ausente',
        hasUser: !!storedUser,
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });
      
      // Validar que tanto el usuario como el token sean válidos
      if (storedUser && token && isValidToken(token)) {
        setUser(storedUser);
        console.log('✅ useAuthPersistence - Usuario autenticado válido:', storedUser);
      } else {
        // Si no hay token válido o usuario, limpiar localStorage
        console.log('⚠️ useAuthPersistence - Token o usuario inválido, limpiando...');
        if (!storedUser) console.log('   - No hay usuario almacenado');
        if (!token) console.log('   - No hay token');
        if (token && !isValidToken(token)) console.log('   - Token inválido');
        
        authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('❌ useAuthPersistence - Error checking auth status:', error);
      authService.logout();
      setUser(null);
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
