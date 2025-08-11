import axiosInstance from '../../utils/axiosConfig';

export const formaPagoService = {
  // Obtener todas las formas de pago
  obtenerFormasPago: async () => {
    const response = await axiosInstance.get('/formas-pago');
    return response.data;
  },

  // Obtener forma de pago por ID
  obtenerFormaPagoPorId: async (id) => {
    const response = await axiosInstance.get(`/forma-pago/${id}`);
    return response.data;
  },

  // Crear nueva forma de pago
  crearFormaPago: async (formaPagoData) => {
    const response = await axiosInstance.post('/forma-pago', formaPagoData);
    return response.data;
  },

  // Actualizar forma de pago existente
  actualizarFormaPago: async (id, formaPagoData) => {
    const response = await axiosInstance.put(`/forma-pago/${id}`, formaPagoData);
    return response.data;
  },

  // Inactivar forma de pago
  inactivarFormaPago: async (id) => {
    const response = await axiosInstance.patch(`/forma-pago/${id}/inactivar`);
    return response.data;
  }
};
