"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = void 0;
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    user_id: { type: String },
    token: { type: String },
    used: { type: Boolean, default: "false" },
}, { timestamps: true });
exports.TokenModel = (0, mongoose_1.model)("Tokens", TokenSchema);
