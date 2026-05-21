"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const notifications_model_1 = require("./notifications.model");
const logger_1 = require("../../common/logger/logger");
const HttpError_1 = require("../../common/utils/HttpError");
const log = new logger_1.Logger("NotificationService");
const sendNotification = async (user_id, payload, type) => {
    log.info("Sending a notification");
    const notification = await notifications_model_1.NotificationsModel.create({
        user_id,
        ...payload,
        type,
    });
    return { notification };
};
const getNotifications = async (user_id) => {
    log.info("get list of notifications for user");
    const notifications = await notifications_model_1.NotificationsModel.find({
        $or: [{ user_id }, { type: "general" }],
    });
    if (notifications.length === 0) {
        throw new HttpError_1.HttpError(404, "No notifications found");
    }
    return { notifications };
};
const readNotification = async (notification_id) => {
    log.info("update notification to read");
    const notification = await notifications_model_1.NotificationsModel.findOneAndUpdate({
        _id: notification_id,
    }, { read: true }, { new: true });
    return { notification };
};
const readAllNotifications = async (user_id) => {
    log.info("Mark all as read");
    const result = await notifications_model_1.NotificationsModel.updateMany({ user_id }, { $set: { read: true } });
    return { result };
};
exports.NotificationsService = {
    sendNotification,
    getNotifications,
    readNotification,
    readAllNotifications,
};
