"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsModel = void 0;
const mongoose_1 = require("mongoose");
const LogsSchema = new mongoose_1.Schema({
    type: { type: String },
    admin: { type: String },
    action: { type: String },
    userId: {
        type: mongoose_1.Types.ObjectId,
        refPath: "userType",
    },
    userType: {
        type: String,
        enum: ["Collectors", "Admins", "Centers"],
    },
}, { timestamps: true });
exports.LogsModel = (0, mongoose_1.model)("Logs", LogsSchema);
