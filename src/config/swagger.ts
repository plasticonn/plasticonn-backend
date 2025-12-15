import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Plasticonn API",
    version: "1.0.0",
    description: "Backend API documentation for Plasticonn",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/modules/auth/*.controller.ts",
    "./src/modules/admin/controllers/*.controller.ts",
    "./src/modules/collectors/*.controller.ts",
    "./src/modules/centers/*.controller.ts",
    "./src/modules/drops/*.controller.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
