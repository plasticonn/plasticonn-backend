"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const email_service_1 = require("../../common/email/email.service");
const HttpError_1 = require("../../common/utils/HttpError");
const otp_1 = require("../../common/utils/otp/otp");
const otp_model_1 = require("../../common/utils/otp/otp.model");
const password_1 = require("../../common/utils/password");
const collectors_model_1 = require("../collectors/collectors.model");
const user_resolver_1 = require("../../common/utils/user-resolver");
const logger_1 = require("../../common/logger/logger");
const centers_model_1 = require("../centers/centers.model");
const templates_1 = require("../../common/email/templates");
const log = new logger_1.Logger("AuthService");
const forgotPassword = async (email) => {
    const resolved = await (0, user_resolver_1.findUserByEmail)(email);
    if (!resolved) {
        return "If the email exists, an OTP has been sent";
    }
    const otp = otp_1.otpServices.generateOtp();
    await otp_1.otpServices.storeOtp(email, otp);
    await email_service_1.EmailService.sendEmail({
        to: email,
        subject: "Password Recovery",
        html: (0, templates_1.changePasswordTemplate)({ otp }),
    });
    return "If the email exists, an OTP has been sent";
};
const confirmPasswordReset = async (email, otp_code) => {
    const result = await otp_1.otpServices.verifyOtp(email, otp_code);
    if (result.error) {
        throw new HttpError_1.HttpError(400, "Invalid or expired OTP");
    }
    await otp_model_1.OtpModel.findOneAndUpdate({ email, otp_code }, { used: true });
    return "OTP verified";
};
const resetPassword = async (email, otp_code, password) => {
    const otp = await otp_model_1.OtpModel.findOne({
        email,
        otp_code,
        used: true,
    });
    if (!otp) {
        throw new HttpError_1.HttpError(400, "OTP not verified");
    }
    const user = await (0, user_resolver_1.findUserByEmail)(email);
    if (!user) {
        throw new HttpError_1.HttpError(404, "User not found");
    }
    const hashed = await password_1.passwordServices.hashPassword(password);
    user.password = hashed;
    user.save();
    await otp_model_1.OtpModel.deleteMany({ email });
    return "Password reset successfully";
};
const changePassword = async (userId, curPassword, role) => {
    log.info("Change password initialized");
    let user;
    // Fetch user based on role
    if (role === "collector") {
        user = await collectors_model_1.CollectorsModel.findById(userId);
        if (!user)
            throw new HttpError_1.HttpError(404, "Collector not found");
    }
    else if (role === "center") {
        user = await centers_model_1.CenterModel.findById(userId);
        if (!user)
            throw new HttpError_1.HttpError(404, "Center not found");
    }
    // Verify current password
    const match = await password_1.passwordServices.verifyPassword(curPassword, user.password);
    if (!match)
        throw new HttpError_1.HttpError(422, "Invalid password");
    // Generate OTP
    const otp = otp_1.otpServices.generateOtp();
    // Determine email
    const email = role === "center" ? user.contactEmail : user.email;
    await otp_1.otpServices.storeOtp(String(email), otp);
    await email_service_1.EmailService.sendEmail({
        to: String(email),
        subject: "Change password",
        html: `
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This code expires in 10 minutes.</p>
    `,
    });
    return "If the email exists, an OTP has been sent";
};
const verifyPasswordUpdate = async (userId, role, payload) => {
    log.info("Verify password change");
    let user;
    // Fetch user based on role
    if (role === "collector") {
        user = await collectors_model_1.CollectorsModel.findById(userId);
        if (!user)
            throw new HttpError_1.HttpError(404, "Collector not found");
    }
    else if (role === "center") {
        user = await centers_model_1.CenterModel.findById(userId);
        if (!user)
            throw new HttpError_1.HttpError(404, "Center not found");
    }
    if (!user)
        throw new HttpError_1.HttpError(404, `${role} not found`);
    const email = role === "center" ? user.contactEmail : user.email;
    const verify = await otp_1.otpServices.verifyOtp(String(email), payload.otp);
    if (verify.error) {
        throw new HttpError_1.HttpError(400, verify.error);
    }
    const password = await password_1.passwordServices.hashPassword(payload.newPassword);
    user.password = password;
    await user.save();
    return {
        message: "Password updated successfully",
    };
};
exports.AuthServices = {
    forgotPassword,
    confirmPasswordReset,
    resetPassword,
    changePassword,
    verifyPasswordUpdate,
};
