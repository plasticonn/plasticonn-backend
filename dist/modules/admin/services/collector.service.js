"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorServices = void 0;
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const Logs_service_1 = require("../../activity_logs/Logs.service");
const collectors_model_1 = require("../../collectors/collectors.model");
const log = new logger_1.Logger("CollectorManagement");
const getCollector = async (collectorId) => {
    log.info("Fetching collector profile");
    const collector = await collectors_model_1.CollectorsModel.findById(collectorId).select("-password");
    if (!collector)
        throw new HttpError_1.HttpError(404, "Collector not found");
    return { collector };
};
const updateCollector = async (collectorId, payload) => {
    log.info("Updating collector profile");
    const collector = await collectors_model_1.CollectorsModel.findById(collectorId);
    if (!collector)
        throw new HttpError_1.HttpError(404, "Collector not found");
    Object.assign(collector, payload);
    await collector.save();
    return { collector };
};
const updateStatus = async (collectorId, status) => {
    log.info("Updating collector status");
    const collector = await collectors_model_1.CollectorsModel.findById(collectorId);
    if (!collector)
        throw new HttpError_1.HttpError(404, "Collector not found");
    Object.assign(collector, status);
    await (0, Logs_service_1.addLog)({
        type: "Status update",
        admin: "Super admin",
        action: `Collector status has been updated to ${status}`,
        userId: collectorId,
        userType: "Collectors",
    });
    await collector.save();
    return { collector };
};
const deleteCollector = async (collectorId) => {
    log.info("Deleting collector");
    const collector = await collectors_model_1.CollectorsModel.findByIdAndDelete(collectorId);
    if (!collector) {
        throw new HttpError_1.HttpError(404, "Collector not found");
    }
    await (0, Logs_service_1.addLog)({
        type: "Account deletion",
        admin: "Admin",
        action: `Collector account has been deleted by admin`,
        userId: collectorId,
        userType: "Collectors",
    });
    return { message: "Collector deleted successfully" };
};
const getCollectors = async () => {
    log.info("Getting all collectors");
    const collectors = await collectors_model_1.CollectorsModel.find().select("-password");
    if (collectors.length <= 0)
        throw new HttpError_1.HttpError(404, "No collectors found");
    return { collectors };
};
exports.CollectorServices = {
    getCollector,
    getCollectors,
    updateCollector,
    updateStatus,
    deleteCollector,
};
