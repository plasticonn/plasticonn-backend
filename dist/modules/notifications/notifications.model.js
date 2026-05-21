"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModel = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    title: { type: String, allowNull: false },
    message: { type: String, allowNull: false },
    user_id: { type: String, allowNull: true },
    type: { type: String, default: "individual" },
    read: { type: Boolean, default: false },
}, { timestamps: true });
exports.NotificationsModel = (0, mongoose_1.model)("Notifications", NotificationSchema);
