import {Express} from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GymnastLink REST API",
      version: "1.0.0",
      description: "GymnastLink REST server including authentication using JWT",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsDoc(swaggerConfig);

const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};

export {setupSwagger};
