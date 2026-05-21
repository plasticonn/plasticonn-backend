"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    image: {
        url: String,
        public_id: String,
    },
    title: { type: String },
    content: { type: String },
    author: { type: String },
    role: { type: String },
    status: { type: String, default: "draft" },
}, { timestamps: true });
exports.BlogModel = (0, mongoose_1.model)("Blogs", BlogSchema);
