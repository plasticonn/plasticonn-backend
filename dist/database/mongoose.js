"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const logger_1 = require("../common/logger/logger");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongoUri);
        logger_1.logger.info({ message: "MongoDB connected", context: "Mongoose" });
    }
    catch (err) {
        logger_1.logger.error({ message: err.message, context: "Mongoose" });
        process.exit(1);
    }
};
exports.connectDB = connectDB;
