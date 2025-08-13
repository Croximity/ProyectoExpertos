import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si hay un usuario válido, redirigir al dashboard
  if (user) {
    return <Navigate to="/admin/index" replace />;
  }

  // Si no hay usuario, permitir acceso a las rutas públicas (login, register)
  return children;
};

export default PublicRoute;
