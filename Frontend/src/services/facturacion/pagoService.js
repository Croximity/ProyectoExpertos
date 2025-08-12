import axiosInstance from '../../utils/axiosConfig';

export const pagoService = {
  // Crear un nuevo pago
  crearPago: async (pagoData) => {
    const response = await axiosInstance.post('/pagos', pagoData);
    return response.data;
  },

  // Obtener todos los pagos
  obtenerPagos: async () => {
    const response = await axiosInstance.get('/pagos');
    return response.data;
  },

  // Obtener pago por ID
  obtenerPagoPorId: async (id) => {
    const response = await axiosInstance.get(`/pagos/${id}`);
    return response.data;
  },

  // Obtener pagos por factura
  obtenerPagosPorFactura: async (idFactura) => {
    const response = await axiosInstance.get(`/pagos/factura/${idFactura}`);
    return response.data;
  },

  // Anular un pago
  anularPago: async (id) => {
    const response = await axiosInstance.patch(`/pagos/${id}/anular`);
    return response.data;
  }
};
