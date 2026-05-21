"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const config_1 = require("../../config");
const logFormat = winston_1.default.format.printf(({ level, message, timestamp, context }) => {
    return `${timestamp} [${level.toUpperCase()}]${context ? " [" + context + "]" : ""}: ${message}`;
});
exports.logger = winston_1.default.createLogger({
    level: config_1.config.env === "development" ? "debug" : "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), logFormat),
        }),
        new winston_daily_rotate_file_1.default({
            dirname: "logs",
            filename: "app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d",
            zippedArchive: true,
            level: "info",
        }),
    ],
});
class Logger {
    context;
    constructor(context) {
        this.context = context;
    }
    info(msg) {
        exports.logger.info({ message: msg, context: this.context });
    }
    warn(msg) {
        exports.logger.warn({ message: msg, context: this.context });
    }
    error(msg) {
        exports.logger.error({ message: msg, context: this.context });
    }
    debug(msg) {
        exports.logger.debug({ message: msg, context: this.context });
    }
}
exports.Logger = Logger;
