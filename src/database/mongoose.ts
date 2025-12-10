import mongoose from "mongoose";
import { config } from "../config";
import { logger } from "../common/logger/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info({ message: "MongoDB connected", context: "Mongoose" });
  } catch (err: any) {
    logger.error({ message: err.message, context: "Mongoose" });
    process.exit(1);
  }
};
