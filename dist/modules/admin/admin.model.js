"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ["super_admin", "admin"] },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
}, { timestamps: true });
exports.AdminModel = (0, mongoose_1.model)("Admins", AdminSchema);
