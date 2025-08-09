import axiosInstance from '../../utils/axiosConfig';

export const reparacionLentesService = {
  obtenerReparaciones: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.idConsulta) params.append('idConsulta', filtros.idConsulta);
    if (filtros.tipoReparacion) params.append('tipoReparacion', filtros.tipoReparacion);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    
    const queryString = params.toString();
    const url = queryString ? `/reparacion-lentes/listar?${queryString}` : '/reparacion-lentes/listar';
    
    const response = await axiosInstance.get(url);
    return response.data;
  },

  obtenerReparacionLentePorId: async (id) => {
    const response = await axiosInstance.get(`/reparacion-lentes/obtener/${id}`);
    return response.data;
  },

  crearReparacionLente: async (reparacionData) => {
    // Convertir campos al formato que espera el backend
    const dataToSend = {
      Tipo_Reparacion: reparacionData.tipoReparacion,
      idConsulta: reparacionData.idConsulta,
      Descripcion: reparacionData.descripcion,
      Costo: reparacionData.costo
    };
    const response = await axiosInstance.post('/reparacion-lentes/guardar', dataToSend);
    return response.data;
  },

  actualizarReparacionLente: async (id, reparacionData) => {
    // Convertir campos al formato que espera el backend
    const dataToSend = {
      Tipo_Reparacion: reparacionData.tipoReparacion,
      idConsulta: reparacionData.idConsulta,
      Descripcion: reparacionData.descripcion,
      Costo: reparacionData.costo
    };
    const response = await axiosInstance.put(`/reparacion-lentes/editar/${id}`, dataToSend);
    return response.data;
  },

  eliminarReparacionLente: async (id) => {
    const response = await axiosInstance.delete(`/reparacion-lentes/eliminar/${id}`);
    return response.data;
  }
};
