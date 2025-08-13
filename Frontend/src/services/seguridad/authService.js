import axiosInstance from '../../utils/axiosConfig';

export const authService = {
  login: async (credentials) => {
    console.log('authService - login: Iniciando login con credenciales');
    const response = await axiosInstance.post('/auth/login', credentials);
    
    if (response.data.token) {
      console.log('authService - login: Token recibido, guardando en localStorage');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.user));
    } else {
      console.log('authService - login: No se recibió token en la respuesta');
    }
    
    return response.data;
  },

  register: async (userData) => {
    try {
      console.log('authService - register: Iniciando registro con datos:', userData);
      
      // Paso 1: Registrar la persona primero
      const personaData = {
        Pnombre: userData.Pnombre,
        Snombre: userData.Snombre || '',
        Papellido: userData.Papellido,
        Sapellido: userData.Sapellido || '',
        Direccion: userData.Direccion || '',
        DNI: userData.DNI,
        correo: userData.correo,
        fechaNacimiento: userData.fechaNacimiento || null,
        genero: userData.genero
      };
      
      console.log('authService - register: Enviando datos de persona:', personaData);
      const personaResponse = await axiosInstance.post('/auth/registrar-persona', personaData);
      console.log('authService - register: Respuesta de persona:', personaResponse.data);
      
      // Paso 2: Registrar el usuario con el idPersona obtenido
      const usuarioData = {
        Nombre_Usuario: userData.Nombre_Usuario,
        contraseña: userData.contraseña, // Con ñ
        idPersona: personaResponse.data.idPersona,
        idrol: parseInt(userData.idrol) // Asegurar que sea número
      };
      
      console.log('authService - register: Enviando datos de usuario:', usuarioData);
      const usuarioResponse = await axiosInstance.post('/auth/registro', usuarioData);
      console.log('authService - register: Respuesta de usuario:', usuarioResponse.data);
      
      return usuarioResponse.data;
    } catch (error) {
      console.error('authService - register: Error detallado en registro:', error);
      if (error.response) {
        console.error('authService - register: Error response data:', error.response.data);
        const serverError = new Error(error.response.data.mensaje || error.response.data.errores?.[0]?.msg || 'Error en el servidor');
        serverError.response = error.response;
        throw serverError;
      }
      throw error; // Relanzar el error si no es de respuesta del servidor
    }
  },

  verifyPin: async (pinData) => {
    console.log('authService - verifyPin: Verificando PIN');
    const response = await axiosInstance.post('/auth/verificar-pin', pinData);

    if (response.data.token) {
      console.log('authService - verifyPin: Token recibido, guardando en localStorage');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.user));
    } else {
      console.log('authService - verifyPin: No se recibió token en la respuesta');
    }

    return response.data;
  },

  logout: () => {
    console.log('authService - logout: Limpiando localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getToken: () => {
    const token = localStorage.getItem('token');
    console.log('authService - getToken:', { token: token ? 'Presente' : 'Ausente' });
    return token;
  },

  getCurrentUser: () => {
    const usuario = localStorage.getItem('usuario');
    const parsedUser = usuario ? JSON.parse(usuario) : null;
    console.log('authService - getCurrentUser:', { usuario, parsedUser });
    return parsedUser;
  },

  obtenerUsuarioActual: async () => {
    console.log('authService - obtenerUsuarioActual: Obteniendo usuario actual del servidor');
    const response = await axiosInstance.get('/auth/usuario-actual');
    console.log('authService - obtenerUsuarioActual: Respuesta del servidor:', response.data);
    return response.data;
  },

  obtenerUsuarios: async () => {
    console.log('authService - obtenerUsuarios: Obteniendo lista de usuarios');
    const response = await axiosInstance.get('/auth/listar');
    console.log('authService - obtenerUsuarios: Respuesta del servidor:', response.data);
    return response.data;
  },

  asociarPersonaAUsuario: async (data) => {
    console.log('authService - asociarPersonaAUsuario: Asociando persona a usuario');
    const response = await axiosInstance.post('/auth/asociar-persona', data);
    console.log('authService - asociarPersonaAUsuario: Respuesta del servidor:', response.data);
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
