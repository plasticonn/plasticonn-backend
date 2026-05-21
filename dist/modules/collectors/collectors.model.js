"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorsModel = void 0;
const mongoose_1 = require("mongoose");
const CollectorsSchema = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    image: {
        url: { type: String },
        public_id: { type: String },
    },
    role: { type: String, default: "collector" },
    status: { type: String, default: "active", enum: ["active", "suspended"] },
}, { timestamps: true });
exports.CollectorsModel = (0, mongoose_1.model)("Collectors", CollectorsSchema);
