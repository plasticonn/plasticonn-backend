import { createApp } from "./app";
import { connectDB } from "./database/mongoose";
import { config } from "./config";
import { logger } from "./common/logger/logger";

(async () => {
  await connectDB();
  const app = createApp();

  app.listen(config.port, () => {
    logger.info({
      message: `Server running on http://localhost:${config.port} in ${config.env} environment`,
      context: "Bootstrap",
    });
    logger.info({
      message: `Swagger docs available at http://localhost:${config.port}/api-docs`,
      context: "Bootstrap",
    });
  });
})();
