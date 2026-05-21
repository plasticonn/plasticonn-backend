"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    if (!email)
        return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};
exports.isValidEmail = isValidEmail;
