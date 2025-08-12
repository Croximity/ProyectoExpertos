// services/facturaService.js  
import axiosInstance from '../../utils/axiosConfig';
import { authService } from '../seguridad/authService';
  
export const facturaService = {  
  // Obtener todas las facturas  
  obtenerFacturas: async () => {  
    const response = await axiosInstance.get('/facturas');
    return response.data;  
  },  
    
  // Crear factura completa  
  crearFacturaCompleta: async (data) => {  
    const response = await axiosInstance.post('/factura-completa', data);
    return response.data;
  },  
    
  // Crear factura por consulta médica
  crearFacturaPorConsulta: async (data) => {
    const response = await axiosInstance.post('/factura-consulta', data);
    return response.data;
  },
    
  // Obtener factura por ID  
  obtenerFacturaPorId: async (id) => {  
    const response = await axiosInstance.get(`/factura/${id}`);
    return response.data;
  },  
    
  // Anular factura  
  anularFactura: async (id) => {  
    const response = await axiosInstance.patch(`/facturas/${id}/anular`);
    return response.data;
  },  
    
  // Obtener estadísticas de facturación
  obtenerEstadisticas: async () => {
    // Retornar datos vacíos ya que se eliminaron las rutas de estadísticas
    const datosVacios = {
      resumen: { totalMes: 0, emitidas: 0, pendientes: 0, pagadas: 0, anuladas: 0 },
      porTipo: { consulta: 0, producto: 0, servicio: 0, mixto: 0 },
      ultimasFacturas: []
    };
    return datosVacios;
  },
    
  // Obtener siguiente número de factura
  obtenerSiguienteNumeroFactura: async () => {  
    const response = await axiosInstance.get('/factura/siguiente-numero');  
    return response.data;  
  },
    
  // Descargar PDF de factura  
  descargarPDF: async (id) => {  
    try {
      const response = await axiosInstance.get(`/factura/${id}/pdf`, {
        responseType: 'blob'
      });
      
      // Crear un blob y descargarlo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al descargar el PDF: ' + (error.response?.data?.error || error.message));
    }
  }  
};
