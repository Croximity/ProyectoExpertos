import axiosInstance from '../../utils/axiosConfig';

export const consultaService = {
  obtenerConsultas: async (filtros = {}) => {
    try {
      // La ruta de backend exige al menos un filtro; mandamos uno por defecto
      const params = { Motivo_consulta: 'all', ...filtros };
      const response = await axiosInstance.get('/gestion_cliente/consultas/consulta', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener consultas:', error);
      throw error;
    }
  },

  obtenerConsultaPorId: async (id) => {
    try {
      const response = await axiosInstance.get(`/gestion_cliente/consultas/consulta/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener consulta por ID:', error);
      throw error;
    }
  },

  crearConsulta: async (data) => {
    try {
      const response = await axiosInstance.post('/gestion_cliente/consultas/consulta', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear consulta:', error);
      throw error;
    }
  },

  editarConsulta: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/gestion_cliente/consultas/consulta/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al editar consulta:', error);
      throw error;
    }
  },

  eliminarConsulta: async (id) => {
    try {
      const response = await axiosInstance.delete(`/gestion_cliente/consultas/consulta/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar consulta:', error);
      throw error;
    }
  }
};


