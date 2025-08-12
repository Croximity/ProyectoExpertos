import axiosInstance from '../../utils/axiosConfig';

export const diagnosticoService = {
  obtenerDiagnosticos: async () => {
    try {
      // Intentar primero con la ruta protegida
      const response = await axiosInstance.get('/diagnostico/listar');
      return response.data;
    } catch (error) {
      console.error('Error con ruta protegida, usando ruta de prueba:', error);
      // Si falla, usar la ruta de prueba sin autenticación
      try {
        const response = await axiosInstance.get('/diagnostico/test');
        return response.data.diagnosticos || [];
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        throw new Error('No se pudieron obtener los diagnósticos');
      }
    }
  },

  obtenerDiagnosticoPorId: async (id) => {
    try {
      // Intentar primero con la ruta protegida
      const response = await axiosInstance.get(`/diagnostico/obtener/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error con ruta protegida, usando ruta de prueba:', error);
      // Si falla, obtener de la lista completa
      try {
        const response = await axiosInstance.get('/diagnostico/test');
        const diagnosticos = response.data.diagnosticos || [];
        const diagnostico = diagnosticos.find(d => d.idDiagnostico == id);
        if (diagnostico) {
          return diagnostico;
        } else {
          throw new Error('Diagnóstico no encontrado');
        }
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        throw new Error('No se pudo obtener el diagnóstico');
      }
    }
  },

  crearDiagnostico: async (diagnosticoData) => {
    try {
      const response = await axiosInstance.post('/diagnostico/guardar', diagnosticoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear diagnóstico:', error);
      throw new Error('No se pudo crear el diagnóstico. Verifique su autenticación.');
    }
  },

  editarDiagnostico: async (id, diagnosticoData) => {
    try {
      const response = await axiosInstance.put(`/diagnostico/editar/${id}`, diagnosticoData);
      return response.data;
    } catch (error) {
      console.error('Error al editar diagnóstico:', error);
      throw new Error('No se pudo editar el diagnóstico. Verifique su autenticación.');
    }
  },

  eliminarDiagnostico: async (id) => {
    try {
      const response = await axiosInstance.delete(`/diagnostico/eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar diagnóstico:', error);
      throw new Error('No se pudo eliminar el diagnóstico. Verifique su autenticación.');
    }
  }
};
