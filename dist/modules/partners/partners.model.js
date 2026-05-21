"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnersModel = void 0;
const mongoose_1 = require("mongoose");
const PartnerSchema = new mongoose_1.Schema({
    logo: {
        url: String,
        public_id: String,
    },
    name: { type: String },
}, { timestamps: true });
exports.PartnersModel = (0, mongoose_1.model)("Partners", PartnerSchema);
