import axiosInstance from '../../utils/axiosConfig';

export const descuentoService = {
  // Obtener todos los descuentos
  obtenerDescuentos: async () => {
    const response = await axiosInstance.get('/descuentos');
    return response.data;
  },

  // Obtener descuento por ID
  obtenerDescuentoPorId: async (id) => {
    const response = await axiosInstance.get(`/descuento/${id}`);
    return response.data;
  },

  // Crear nuevo descuento
  crearDescuento: async (descuentoData) => {
    const response = await axiosInstance.post('/descuento', descuentoData);
    return response.data;
  },

  // Actualizar descuento existente
  actualizarDescuento: async (id, descuentoData) => {
    const response = await axiosInstance.put(`/descuento/${id}`, descuentoData);
    return response.data;
  },

  // Eliminar descuento
  eliminarDescuento: async (id) => {
    const response = await axiosInstance.delete(`/descuento/${id}`);
    return response.data;
  }
};
