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
      {
        url: "http://10.10.246.79",
      },
      {
        url: "https://10.10.246.79",
      },
      {
        url: "https://193.106.55.240",
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
