"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = exports.addLog = void 0;
const logger_1 = require("../../common/logger/logger");
const HttpError_1 = require("../../common/utils/HttpError");
const Logs_model_1 = require("./Logs.model");
const log = new logger_1.Logger("Logs service");
const addLog = async (payload) => {
    try {
        log.info("Adding a new log");
        const add = await Logs_model_1.LogsModel.create(payload);
        if (add)
            return { success: true };
    }
    catch (error) {
        return { error: true, message: error };
    }
};
exports.addLog = addLog;
const getLogs = async () => {
    log.info("Getting list of logs");
    const logs = await Logs_model_1.LogsModel.find()
        .populate("userId", "name email role")
        .sort({ createdAt: -1 });
    if (!logs.length) {
        throw new HttpError_1.HttpError(404, "There are no logs");
    }
    return { logs };
};
exports.getLogs = getLogs;
// export const readLogs = async () => {
//   log.info("Marking logs as read");
// };
