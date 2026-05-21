"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropsService = void 0;
const drops_model_1 = require("./drops.model");
const logger_1 = require("../../common/logger/logger");
const HttpError_1 = require("../../common/utils/HttpError");
const notifications_service_1 = require("../notifications/notifications.service");
const generateCode_1 = require("../../common/utils/generateCode");
const cloudinary_1 = require("../../common/utils/cloudinary");
const log = new logger_1.Logger("DropsService");
const addDrop = async (user_id, payload, file) => {
    log.info("Adding a drop offs");
    const parsedPayload = {
        ...payload,
        types: Array.isArray(payload.types)
            ? payload.types
            : JSON.parse(payload.types || "[]"),
    };
    const dropId = (0, generateCode_1.generateDropId)();
    let image = null;
    if (file) {
        const uploaded = await (0, cloudinary_1.uploadToCloudinary)(file);
        image = {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    }
    const drop = await drops_model_1.DropsModel.create({
        drop_id: dropId,
        collector_id: user_id,
        ...parsedPayload,
        image,
        location: {
            type: "Point",
            coordinates: [Number(payload.lng), Number(payload.lat)],
        },
    });
    const message = {
        title: "New drop off",
        message: "You have a new drop-off request.",
    };
    await notifications_service_1.NotificationsService.sendNotification(payload.center_id, message, "individual");
    return { drop };
};
const getDropList = async (user_id) => {
    log.info("get list of drop offs");
    const drops = await drops_model_1.DropsModel.find({
        $or: [{ collector_id: user_id }, { center_id: user_id }],
    })
        .populate("collector_id", "firstName image")
        .populate("center_id", "name image");
    if (drops.length === 0) {
        throw new HttpError_1.HttpError(404, "No drops found");
    }
    return { drops };
};
const getDropById = async (drop_id, user_id) => {
    const drop = await drops_model_1.DropsModel.findOne({
        _id: drop_id,
        $or: [{ collector_id: user_id }, { center_id: user_id }],
    });
    if (!drop)
        throw new HttpError_1.HttpError(404, "Drop not found");
    return { drop };
};
const updateDrop = async (drop_id, center_id, status) => {
    const drop = await drops_model_1.DropsModel.findOneAndUpdate({
        _id: drop_id,
        center_id,
    }, { status: status }, { new: true });
    if (!drop) {
        throw new HttpError_1.HttpError(403, "You are not authorized to verify this drop or it does not exist");
    }
    const payload = {
        title: "Status Update Notification",
        message: `Your drop-off has been ${status}.`,
    };
    await notifications_service_1.NotificationsService.sendNotification(String(drop?.collector_id), payload, "individual");
    return { drop };
};
exports.DropsService = {
    addDrop,
    getDropList,
    getDropById,
    updateDrop,
};
