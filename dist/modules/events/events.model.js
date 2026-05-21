"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModel = void 0;
const mongoose_1 = require("mongoose");
const EventsSchema = new mongoose_1.Schema({
    title: { type: String },
    description: { type: String },
    category: { type: String },
    date: { type: String },
    time: { type: String },
}, { timestamps: true });
exports.EventsModel = (0, mongoose_1.model)("Events", EventsSchema);
