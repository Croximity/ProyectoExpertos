const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API-Optica',
      version: '1.0.0',
      description: 'API del sistemas expertos',
      contact: {
        email: 'ajgamez02@gmail.com'
      },
    },
    servers: [
        {
          url: 'http://localhost:'+ process.env.puerto +'/api/optica', // URL del servidor
          description: 'Servidor local',
        },
    ],
    components: {
      securitySchemes: {
          BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
          }
      }
    },

  },
  apis: [
    './rutas/seguridad/*.js',
    './rutas/gestion_cliente/*.js',
    './rutas/productos/*.js',
    './rutas/consulta_examenes/*.js',
    './rutas/facturacion/*.js',
  ], // Ruta a los archivos donde están definidas las rutas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;