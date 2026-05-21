"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordServices = void 0;
const argon2_1 = __importDefault(require("argon2"));
const generatePassword = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};
const hashPassword = async (pin) => {
    try {
        const hashedPassword = await argon2_1.default.hash(pin);
        return hashedPassword;
    }
    catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password.");
    }
};
const verifyPassword = async (pin, hashedPin) => {
    try {
        return await argon2_1.default.verify(hashedPin, pin);
    }
    catch (err) {
        console.error("Error verifying password:", err);
        throw new Error("Failed to verify password.");
    }
};
exports.passwordServices = {
    hashPassword,
    verifyPassword,
    generatePassword,
};
