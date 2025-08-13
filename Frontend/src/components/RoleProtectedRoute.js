import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const roleName = user?.idrol?.nombre || user?.rol?.nombre || user?.role?.nombre || user?.rolNombre || localStorage.getItem('rol') || 'Colaborador';

  if (allowedRoles.length > 0 && !allowedRoles.includes(roleName)) {
    alert('No tiene permisos suficientes para acceder a esta sección');
    return <Navigate to="/admin/index" replace />;
  }

  return children;
};

export default RoleProtectedRoute;


