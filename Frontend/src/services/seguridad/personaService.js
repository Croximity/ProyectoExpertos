import axiosInstance from '../../utils/axiosConfig';

export const personaService = {
  obtenerPersonas: async () => {
    const response = await axiosInstance.get('/auth/personas');
    return response.data;
  },

  obtenerPersonaPorId: async (id) => {
    const response = await axiosInstance.get(`/auth/personas/${id}`);
    return response.data;
  },

  crearPersona: async (personaData) => {
    const response = await axiosInstance.post('/auth/registrar-persona', personaData);
    return response.data;
  },

  actualizarPersona: async (id, personaData) => {
    const response = await axiosInstance.put(`/auth/personas/${id}`, personaData);
    return response.data;
  },

  eliminarPersona: async (id) => {
    const response = await axiosInstance.delete(`/auth/personas/${id}`);
    return response.data;
  },

  // Verificar si un DNI ya existe
  verificarDNIExistente: async (dni, personaIdExcluir = null) => {
    try {
      const response = await axiosInstance.get(`/auth/personas/verificar-dni/${dni}${personaIdExcluir ? `?excluir=${personaIdExcluir}` : ''}`);
      return response.data;
    } catch (error) {
      // Si no existe el endpoint, hacer búsqueda manual
      const personas = await axiosInstance.get('/auth/personas');
      const personaExistente = personas.data.find(p => p.DNI === dni && p._id !== personaIdExcluir);
      return { existe: !!personaExistente, persona: personaExistente };
    }
  },

  // Verificar si una persona ya es empleado
  verificarPersonaEmpleado: async (personaId) => {
    try {
      const response = await axiosInstance.get(`/gestion_cliente/empleados/empleado/verificar-persona/${personaId}`);
      return response.data;
    } catch (error) {
      // Si no existe el endpoint, hacer búsqueda manual
      const empleados = await axiosInstance.get('/gestion_cliente/empleados/empleado');
      const empleadoExistente = empleados.data.find(e => e.idPersona === personaId);
      return { esEmpleado: !!empleadoExistente, empleado: empleadoExistente };
    }
  },

  // Verificar si una persona ya es cliente
  verificarPersonaCliente: async (personaId) => {
    try {
      const response = await axiosInstance.get(`/gestion_cliente/clientes/cliente/verificar-persona/${personaId}`);
      return response.data;
    } catch (error) {
      // Si no existe el endpoint, hacer búsqueda manual
      const clientes = await axiosInstance.get('/gestion_cliente/clientes/cliente');
      const clienteExistente = clientes.data.find(c => c.idPersona === personaId);
      return { esCliente: !!clienteExistente, cliente: clienteExistente };
    }
  }
};
