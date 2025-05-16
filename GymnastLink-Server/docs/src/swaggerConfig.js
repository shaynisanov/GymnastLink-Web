"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
            {
                url: "https://node79.cs.colman.ac.il",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(swaggerConfig);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swaggerConfig.js.map