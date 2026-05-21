"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const token_model_1 = require("./token.model");
const HttpError_1 = require("../HttpError");
const config_1 = require("../../../config");
dotenv_1.default.config();
const generateAccessToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;
    const options = {
        algorithm: "HS256",
        expiresIn: "1h", // Default expiration time
    };
    if (!secret || !expiresIn) {
        throw new HttpError_1.HttpError(400, "JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
const generateRefreshToken = async (payload) => {
    const secret = config_1.config.jwtSecret;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;
    const options = {
        algorithm: "HS256",
        expiresIn: "7d",
    };
    if (!secret || !expiresIn) {
        throw new HttpError_1.HttpError(400, "JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined");
    }
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    await token_model_1.TokenModel.create({
        user_id: payload.userId,
        token: token,
    });
    return token;
};
const encryptToken = (token) => {
    const secretKey = process.env.CRYPTO_SECRET_KEY;
    if (!token) {
        console.error("Encryption key is missing!");
        throw new HttpError_1.HttpError(400, "JWT_REFRESH_SECRET or REFRESH_TOKEN_EXPIRY is not defined");
    }
    try {
        if (secretKey) {
            const cipherText = crypto_js_1.default.AES.encrypt(token, secretKey).toString();
            return cipherText;
        }
    }
    catch (error) {
        console.error("Encryption error:", error);
        return { error: "Server error" };
    }
};
const decryptToken = (encryptedToken) => {
    const secretKey = process.env.CRYPTO_SECRET_KEY;
    if (!secretKey) {
        console.error("Decryption key is missing!");
        return null;
    }
    try {
        const decodedToken = decodeURIComponent(encryptedToken);
        const bytes = crypto_js_1.default.AES.decrypt(decodedToken, secretKey);
        const decryptedToken = bytes.toString(crypto_js_1.default.enc.Utf8);
        return decryptedToken || null;
    }
    catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};
exports.tokenService = {
    generateAccessToken,
    generateRefreshToken,
    encryptToken,
    decryptToken,
};
