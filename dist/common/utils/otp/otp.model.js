"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    email: { type: String },
    otp_code: { type: String },
    category: { type: String },
    used: { type: Boolean, default: false },
    expiresAt: { type: Date, require: true },
}, { timestamps: true });
exports.OtpModel = (0, mongoose_1.model)("Otps", OtpSchema);
