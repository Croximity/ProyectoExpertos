import axiosInstance from '../../utils/axiosConfig';

export const rolService = {
  obtenerRoles: async () => {
    try {
      console.log('rolService - obtenerRoles: Iniciando petición a /roles/roles');
      const response = await axiosInstance.get('/roles/roles');
      console.log('rolService - obtenerRoles: Respuesta exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('rolService - obtenerRoles: Error al obtener roles:', error);
      throw error;
    }
  },

  obtenerRolPorId: async (id) => {
    try {
      console.log('rolService - obtenerRolPorId: Obteniendo rol con ID:', id);
      const response = await axiosInstance.get(`/roles/rol/${id}`);
      console.log('rolService - obtenerRolPorId: Respuesta exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('rolService - obtenerRolPorId: Error al obtener rol:', error);
      throw error;
    }
  },

  crearRol: async (rolData) => {
    try {
      console.log('rolService - crearRol: Creando rol con datos:', rolData);
      const response = await axiosInstance.post('/roles/rol', rolData);
      console.log('rolService - crearRol: Rol creado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('rolService - crearRol: Error al crear rol:', error);
      throw error;
    }
  },

  actualizarRol: async (id, rolData) => {
    try {
      console.log('rolService - actualizarRol: Actualizando rol con ID:', id);
      const response = await axiosInstance.put(`/roles/rol/${id}`, rolData);
      console.log('rolService - actualizarRol: Rol actualizado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('rolService - actualizarRol: Error al actualizar rol:', error);
      throw error;
    }
  },

  eliminarRol: async (id) => {
    try {
      console.log('rolService - eliminarRol: Eliminando rol con ID:', id);
      const response = await axiosInstance.delete(`/roles/rol/${id}`);
      console.log('rolService - eliminarRol: Rol eliminado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('rolService - eliminarRol: Error al eliminar rol:', error);
      throw error;
    }
  }
};
