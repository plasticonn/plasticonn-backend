"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDropId = exports.generateCenterId = void 0;
const generateCenterId = () => {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `C-${random}`;
};
exports.generateCenterId = generateCenterId;
const generateDropId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `D-${random}`;
};
exports.generateDropId = generateDropId;
