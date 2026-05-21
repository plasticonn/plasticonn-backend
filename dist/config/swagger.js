"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
        "./src/modules/events/*.controller.ts",
        "./src/modules/dashboard/*.controller.ts",
        "./src/modules/activity_logs/*.controller.ts",
        "./src/modules/notifications/*.controller.ts",
        "./src/modules/website/*.controller.ts",
        "./src/modules/gallery/*.controller.ts",
        "./src/modules/partners/*.controller.ts",
        "./src/modules/blogs/*.controller.ts",
        "./src/modules/leaderboard/*.controller.ts",
    ],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.setupSwagger = setupSwagger;
