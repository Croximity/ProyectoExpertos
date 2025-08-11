import axiosInstance from '../../utils/axiosConfig';

export const empleadoService = {
  obtenerEmpleados: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    // Solo agregar parámetros si tienen valor
    if (filtros.Pnombre && filtros.Pnombre.trim()) {
      params.append('Pnombre', filtros.Pnombre.trim());
    }
    if (filtros.Papellido && filtros.Papellido.trim()) {
      params.append('Papellido', filtros.Papellido.trim());
    }
    if (filtros.correo && filtros.correo.trim()) {
      params.append('correo', filtros.correo.trim());
    }
    if (filtros.DNI && filtros.DNI.trim()) {
      params.append('DNI', filtros.DNI.trim());
    }
    
    const url = `/gestion_cliente/empleados/empleado${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('URL de búsqueda empleados:', url);
    
    const response = await axiosInstance.get(url);
    return response.data;
  },

  obtenerEmpleadoPorId: async (id) => {
    const response = await axiosInstance.get(`/gestion_cliente/empleados/empleado/${id}`);
    return response.data;
  },

  crearEmpleado: async (empleadoData) => {
    const response = await axiosInstance.post('/gestion_cliente/empleados/empleado', empleadoData);
    return response.data;
  },

  editarEmpleado: async (id, empleadoData) => {
    const response = await axiosInstance.put(`/gestion_cliente/empleados/empleado/${id}`, empleadoData);
    return response.data;
  },

  eliminarEmpleado: async (id) => {
    const response = await axiosInstance.delete(`/gestion_cliente/empleados/empleado/${id}`);
    return response.data;
  }
};
