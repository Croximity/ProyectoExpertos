import axiosInstance from '../utils/axiosConfig';

export const testService = {
  // Probar conexión básica
  probarConexion: async () => {
    try {
      console.log('🔍 Probando conexión con el backend...');
      const response = await axiosInstance.get('/');
      console.log('✅ Respuesta del backend:', response);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return { success: false, error: error.message };
    }
  },

  // Probar endpoint específico
  probarEndpoint: async (endpoint) => {
    try {
      console.log(`🔍 Probando endpoint: ${endpoint}`);
      const response = await axiosInstance.get(endpoint);
      console.log(`✅ Respuesta de ${endpoint}:`, response);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`❌ Error en ${endpoint}:`, error);
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      };
    }
  },

           // Probar todos los endpoints del dashboard
         probarTodosLosEndpoints: async () => {
           const endpoints = [
             '/gestion_cliente/clientes/cliente',
             '/gestion_cliente/empleados/empleado',
             '/productos/producto',
             '/categorias/categoria',
             '/receta/listar',
             '/examen-vista/listar',
             '/diagnostico/listar',
             '/facturas',           // ✅ Ruta correcta
             '/pagos'              // ✅ Ruta correcta
           ];

    console.log('🧪 Probando todos los endpoints del dashboard...');
    
    const resultados = {};
    
    for (const endpoint of endpoints) {
      const resultado = await testService.probarEndpoint(endpoint);
      resultados[endpoint] = resultado;
      
      // Pausa pequeña entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('📊 Resumen de pruebas:', resultados);
    return resultados;
  },

  // Verificar configuración de axios
  verificarConfiguracion: () => {
    console.log('🔧 Configuración de axios:', {
      baseURL: axiosInstance.defaults.baseURL,
      timeout: axiosInstance.defaults.timeout,
      headers: axiosInstance.defaults.headers,
      withCredentials: axiosInstance.defaults.withCredentials
    });
    
    return {
      baseURL: axiosInstance.defaults.baseURL,
      timeout: axiosInstance.defaults.timeout,
      headers: axiosInstance.defaults.headers,
      withCredentials: axiosInstance.defaults.withCredentials
    };
  }
};
