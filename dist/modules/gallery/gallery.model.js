"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryModel = void 0;
const mongoose_1 = require("mongoose");
const GallerySchema = new mongoose_1.Schema({
    image: {
        url: String,
        public_id: String,
    },
    event: { type: String },
}, { timestamps: true });
exports.GalleryModel = (0, mongoose_1.model)("Gallery", GallerySchema);
