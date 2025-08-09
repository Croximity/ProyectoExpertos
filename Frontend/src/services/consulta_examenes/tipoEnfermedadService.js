import axiosInstance from '../../utils/axiosConfig';

export const tipoEnfermedadService = {
  obtenerTiposEnfermedad: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.descripcion) params.append('descripcion', filtros.descripcion);
    
    const queryString = params.toString();
    const url = queryString ? `/tipo-enfermedad/listar?${queryString}` : '/tipo-enfermedad/listar';
    
    const response = await axiosInstance.get(url);
    return response.data;
  },

  obtenerTipoEnfermedadPorId: async (id) => {
    const response = await axiosInstance.get(`/tipo-enfermedad/obtener/${id}`);
    return response.data;
  },

  crearTipoEnfermedad: async (tipoData) => {
    // Convertir campos al formato que espera el backend
    const dataToSend = {
      Nombre: tipoData.nombre,
      Descripcion: tipoData.descripcion
    };
    const response = await axiosInstance.post('/tipo-enfermedad/guardar', dataToSend);
    return response.data;
  },

  actualizarTipoEnfermedad: async (id, tipoData) => {
    // Convertir campos al formato que espera el backend
    const dataToSend = {
      Nombre: tipoData.nombre,
      Descripcion: tipoData.descripcion
    };
    const response = await axiosInstance.put(`/tipo-enfermedad/editar/${id}`, dataToSend);
    return response.data;
  },

  eliminarTipoEnfermedad: async (id) => {
    console.log('Servicio: Intentando eliminar tipo de enfermedad con ID:', id);
    console.log('Servicio: URL de eliminación:', `/tipo-enfermedad/eliminar/${id}`);
    try {
      const response = await axiosInstance.delete(`/tipo-enfermedad/eliminar/${id}`);
      console.log('Servicio: Respuesta exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Servicio: Error al eliminar tipo de enfermedad:', error);
      console.error('Servicio: Error response:', error.response);
      console.error('Servicio: Error status:', error.response?.status);
      console.error('Servicio: Error data:', error.response?.data);
      throw error;
    }
  }
};
