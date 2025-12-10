import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../../config";

const logFormat = winston.format.printf(
  ({ level, message, timestamp, context }) => {
    return `${timestamp} [${level.toUpperCase()}]${context ? " [" + context + "]" : ""}: ${message}`;
  }
);

export const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat
      ),
    }),
    new DailyRotateFile({
      dirname: "logs",
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      level: "info",
    }),
  ],
});

export class Logger {
  constructor(private context: string) {}

  info(msg: string) {
    logger.info({ message: msg, context: this.context });
  }
  warn(msg: string) {
    logger.warn({ message: msg, context: this.context });
  }
  error(msg: string) {
    logger.error({ message: msg, context: this.context });
  }
  debug(msg: string) {
    logger.debug({ message: msg, context: this.context });
  }
}
