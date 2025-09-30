import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FocusU API',
      version: '1.0.0',
      description: 'API REST para la aplicación FocusU - Sistema de gestión de eventos y tareas',
      contact: {
        name: 'FocusU Team',
        email: 'support@focusu.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'Token JWT almacenado en cookie'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario'
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del evento'
            },
            title: {
              type: 'string',
              description: 'Título del evento'
            },
            description: {
              type: 'string',
              description: 'Descripción del evento'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de inicio del evento'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de fin del evento'
            },
            userId: {
              type: 'string',
              description: 'ID del usuario propietario'
            },
            completed: {
              type: 'boolean',
              description: 'Estado de completitud del evento'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      },
      {
        cookieAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
