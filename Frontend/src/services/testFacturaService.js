// Archivo de prueba para verificar el servicio de facturas
import { facturaService } from './facturacion/facturaService';

export const testFacturaService = {
  // Probar la obtención de facturas
  probarObtenerFacturas: async () => {
    try {
      console.log('🧪 Probando facturaService.obtenerFacturas()...');
      
      const facturas = await facturaService.obtenerFacturas();
      
      console.log('✅ Respuesta del servicio:', facturas);
      console.log('📊 Tipo de respuesta:', typeof facturas);
      console.log('📊 Es array:', Array.isArray(facturas));
      console.log('📊 Cantidad de facturas:', facturas ? facturas.length : 'undefined');
      
      if (facturas && Array.isArray(facturas) && facturas.length > 0) {
        console.log('📋 Primera factura:', facturas[0]);
        console.log('📋 Última factura:', facturas[facturas.length - 1]);
        
        // Verificar estructura de la primera factura
        const primeraFactura = facturas[0];
        console.log('🔍 Estructura de la primera factura:');
        console.log('  - ID:', primeraFactura.id);
        console.log('  - Número:', primeraFactura.numero);
        console.log('  - Cliente:', primeraFactura.cliente);
        console.log('  - Fecha:', primeraFactura.fecha);
        console.log('  - Total:', primeraFactura.total);
        console.log('  - Estado:', primeraFactura.estado);
      }
      
      return { success: true, data: facturas };
    } catch (error) {
      console.error('❌ Error al probar facturaService:', error);
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  // Probar la obtención de facturas con límite
  probarObtenerFacturasConLimite: async (limite = 5) => {
    try {
      console.log(`🧪 Probando obtención de últimas ${limite} facturas...`);
      
      const facturas = await facturaService.obtenerFacturas();
      
      if (facturas && Array.isArray(facturas) && facturas.length > 0) {
        // Ordenar por fecha y tomar las últimas
        const facturasOrdenadas = facturas
          .sort((a, b) => {
            const fechaA = new Date(a.fecha || a.Fecha || a.createdAt || 0);
            const fechaB = new Date(b.fecha || b.Fecha || b.createdAt || 0);
            return fechaB - fechaA;
          })
          .slice(0, limite);
        
        console.log(`📊 Últimas ${facturasOrdenadas.length} facturas ordenadas:`, facturasOrdenadas);
        return { success: true, data: facturasOrdenadas };
      } else {
        console.log('⚠️ No hay facturas disponibles');
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error('❌ Error al probar obtención con límite:', error);
      return { success: false, error: error.message };
    }
  }
};
