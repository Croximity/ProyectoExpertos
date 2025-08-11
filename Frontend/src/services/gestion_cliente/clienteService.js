import axiosInstance from '../../utils/axiosConfig';

export const clienteService = {
  obtenerClientes: async (filtros = {}) => {
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
    
    const url = `/gestion_cliente/clientes/cliente${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('URL de búsqueda clientes:', url);
    
    const response = await axiosInstance.get(url);
    return response.data;
  },

  obtenerClientePorId: async (id) => {
    const response = await axiosInstance.get(`/gestion_cliente/clientes/cliente/${id}`);
    return response.data;
  },

  crearCliente: async (clienteData) => {
    const response = await axiosInstance.post('/gestion_cliente/clientes/cliente', clienteData);
    return response.data;
  },

  editarCliente: async (id, clienteData) => {
    const response = await axiosInstance.put(`/gestion_cliente/clientes/cliente/${id}`, clienteData);
    return response.data;
  },

  eliminarCliente: async (id) => {
    const response = await axiosInstance.delete(`/gestion_cliente/clientes/cliente/${id}`);
    return response.data;
  }
};
