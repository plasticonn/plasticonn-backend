"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.config = {
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || "changeme",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/plasticonn",
    env: process.env.NODE_ENV || "development",
};
