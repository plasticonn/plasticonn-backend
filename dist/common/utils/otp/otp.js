"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpServices = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const otp_model_1 = require("./otp.model");
const generateOtp = () => {
    const otp = otp_generator_1.default.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    return otp;
};
const storeOtp = async (email, otp_code) => {
    const expiresIn = 5 * 60 * 1000; // OTP expires in 5 minutes
    const expiresAt = new Date(Date.now() + expiresIn);
    await otp_model_1.OtpModel.create({ email, otp_code, expiresAt });
};
const verifyOtp = async (email, otp_code) => {
    const otpEntry = await otp_model_1.OtpModel.findOne({
        email,
        otp_code,
    });
    console.log(otpEntry);
    if (otpEntry === null) {
        return { error: "Invalid OTP" };
    }
    if (otpEntry?.used) {
        return { error: "OTP expired" };
    }
    if (otpEntry?.expiresAt) {
        if (new Date() > otpEntry.expiresAt) {
            return { error: "OTP expired" };
        }
    }
    else {
        return { error: "Invalid OTP" };
    }
    return { success: "OTP verified" };
};
exports.otpServices = { generateOtp, storeOtp, verifyOtp };
