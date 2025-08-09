import axiosInstance from '../../utils/axiosConfig';

export const recetaService = {
  obtenerRecetas: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.idCliente) params.append('idCliente', filtros.idCliente);
    if (filtros.idEmpleado) params.append('idEmpleado', filtros.idEmpleado);
    if (filtros.tipoLente) params.append('tipoLente', filtros.tipoLente);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    
    const queryString = params.toString();
    const url = queryString ? `/receta/listar?${queryString}` : '/receta/listar';
    
    const response = await axiosInstance.get(url);
    return response.data;
  },

  obtenerRecetaPorId: async (id) => {
    const response = await axiosInstance.get(`/receta/obtener/${id}`);
    return response.data;
  },

  crearReceta: async (recetaData) => {
    const response = await axiosInstance.post('/receta/guardar', recetaData);
    return response.data;
  },

  editarReceta: async (id, recetaData) => {
    const response = await axiosInstance.put(`/receta/editar/${id}`, recetaData);
    return response.data;
  },

  eliminarReceta: async (id) => {
    const response = await axiosInstance.delete(`/receta/eliminar/${id}`);
    return response.data;
  }
};
