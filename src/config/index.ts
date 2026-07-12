import { configDotenv } from "dotenv";

configDotenv();

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "changeme",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/plasticonn",
  env: process.env.NODE_ENV || "development",
  SU_ADMIN_MAIL: process.env.SU_ADMIN_MAIL,
  SU_ADMIN_PASSWORD: process.env.SU_ADMIN_PASSWORD,
};
