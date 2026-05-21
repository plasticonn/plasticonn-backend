"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const ApiResponse = (status, message, data = null) => ({
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
});
exports.ApiResponse = ApiResponse;
