import axiosInstance from '../../utils/axiosConfig';

export const examenVistaService = {
  obtenerExamenesVista: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.idConsulta) params.append('idConsulta', filtros.idConsulta);
    if (filtros.idReceta) params.append('idReceta', filtros.idReceta);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    
    const queryString = params.toString();
    const url = queryString ? `/examen-vista/listar?${queryString}` : '/examen-vista/listar';
    
    const response = await axiosInstance.get(url);
    return response.data;
  },

  obtenerExamenVistaPorId: async (id) => {
    const response = await axiosInstance.get(`/examen-vista/obtener/${id}`);
    return response.data;
  },

  crearExamenVista: async (examenData) => {
    const response = await axiosInstance.post('/examen-vista/guardar', examenData);
    return response.data;
  },

  editarExamenVista: async (id, examenData) => {
    const response = await axiosInstance.put(`/examen-vista/editar/${id}`, examenData);
    return response.data;
  },

  eliminarExamenVista: async (id) => {
    const response = await axiosInstance.delete(`/examen-vista/eliminar/${id}`);
    return response.data;
  }
};
