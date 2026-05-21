"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongoose_1 = require("./database/mongoose");
const config_1 = require("./config");
const logger_1 = require("./common/logger/logger");
(async () => {
    await (0, mongoose_1.connectDB)();
    const app = (0, app_1.createApp)();
    app.listen(config_1.config.port, () => {
        logger_1.logger.info({
            message: `Server running on http://localhost:${config_1.config.port} in ${config_1.config.env} environment`,
            context: "Bootstrap",
        });
        logger_1.logger.info({
            message: `Swagger docs available at http://localhost:${config_1.config.port}/api-docs`,
            context: "Bootstrap",
        });
    });
})();
