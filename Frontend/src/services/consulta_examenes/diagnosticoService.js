import axiosInstance from '../../utils/axiosConfig';

export const diagnosticoService = {
  obtenerDiagnosticos: async () => {
    const response = await axiosInstance.get('/diagnostico/listar');
    return response.data;
  },

  obtenerDiagnosticoPorId: async (id) => {
    const response = await axiosInstance.get(`/diagnostico/obtener/${id}`);
    return response.data;
  },

  crearDiagnostico: async (diagnosticoData) => {
    const response = await axiosInstance.post('/diagnostico/guardar', diagnosticoData);
    return response.data;
  },

  editarDiagnostico: async (id, diagnosticoData) => {
    const response = await axiosInstance.put(`/diagnostico/editar/${id}`, diagnosticoData);
    return response.data;
  },

  eliminarDiagnostico: async (id) => {
    const response = await axiosInstance.delete(`/diagnostico/eliminar/${id}`);
    return response.data;
  }
};
