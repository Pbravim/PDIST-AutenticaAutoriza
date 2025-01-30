import authorize from '../../_Autorização/middlewares/authorize';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API',
      version: '1.0.0',
      description: 'Documentação da API com JSDoc e Swagger',
    },
    servers: [
      {
        url: "${process.env.BASE_URL}:${process.env.PORT}/api-docs",
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação baseada em token',
        },
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'authSession',  // Nome do cookie de sessão (ajuste conforme necessário)
          description: 'Autenticação baseada em sessão com cookie',
        },
      },
    },
  },
  apis: ['./src/**/*.js', './src/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerRouter = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // app.use('/docs', authorize, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerRouter;
