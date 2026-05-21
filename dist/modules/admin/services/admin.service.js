"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_model_1 = require("../admin.model");
const config_1 = require("../../../config");
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const password_1 = require("../../../common/utils/password");
const otp_1 = require("../../../common/utils/otp/otp");
const email_service_1 = require("../../../common/email/email.service");
const templates_1 = require("../../../common/email/templates");
const log = new logger_1.Logger("AdminService");
// export const loginSuperAdmin = async (email: string, password: string) => {
//   log.info("logging in super admin");
//   const suEmail = process.env.SU_ADMIN_MAIL;
//   const suPassword = process.env.SU_ADMIN_PASSWORD;
//   if (email !== suEmail || password !== suPassword) {
//     throw new HttpError(401, "Invalid credentials");
//   }
//   const admin = await AdminModel.findOne({ email });
//   if (!admin) throw new HttpError(404, "Admin does not exist");
//   const accessToken = tokenService.generateAccessToken({
//     userId: String(admin?._id),
//     role: String(admin?.role),
//   });
//   const refreshToken = await tokenService.generateRefreshToken({
//     userId: String(admin?._id),
//     role: Roles.SUPER_ADMIN,
//   });
//   return { admin, accessToken, refreshToken };
// };
const login = async (email, password) => {
    log.info("logging in admin");
    const admin = await admin_model_1.AdminModel.findOne({ email }).select("+password");
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin does not exist");
    //const match = await bcrypt.compare(password, String(admin.password));
    console.log(admin.password);
    // const match = await passwordServices.verifyPassword(
    //   password,
    //   String(admin.password),
    // );
    // if (!match) throw new HttpError(422, "Invalid password");
    const token = jsonwebtoken_1.default.sign({ sub: admin._id, role: admin.role }, config_1.config.jwtSecret, {
        expiresIn: "7d",
    });
    return { admin, token };
};
const getProfile = async (adminId) => {
    log.info("Fetching admin profile");
    const admin = await admin_model_1.AdminModel.findById(adminId).select("-password");
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin not found");
    return { admin };
};
const updateProfile = async (adminId, payload) => {
    log.info("Updating admin profile");
    const admin = await admin_model_1.AdminModel.findById(adminId);
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin not found");
    Object.assign(admin, payload);
    await admin.save();
    return { admin };
};
const updatePassword = async (adminId, payload) => {
    log.info("Change password");
    const admin = await admin_model_1.AdminModel.findById(adminId);
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin not found");
    const match = await password_1.passwordServices.verifyPassword(payload.curPassword, String(admin.password));
    if (!match)
        throw new HttpError_1.HttpError(422, "Invalid password");
    const otp = otp_1.otpServices.generateOtp();
    await otp_1.otpServices.storeOtp(String(admin.email), otp);
    await email_service_1.EmailService.sendEmail({
        to: String(admin.email),
        subject: "Password Change Confirmation",
        html: (0, templates_1.changePasswordTemplate)({ otp: otp }),
    });
};
const verifyPasswordUpdate = async (adminId, payload) => {
    log.info("Verify password change");
    const admin = await admin_model_1.AdminModel.findById(adminId);
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin not found");
    const verify = await otp_1.otpServices.verifyOtp(String(admin.email), payload.otp);
    if (verify.error) {
        throw new HttpError_1.HttpError(400, verify.error);
    }
    console.log(payload.newPassword);
    const password = await password_1.passwordServices.hashPassword(payload.newPassword);
    admin.password = password;
    await admin.save();
    return { admin };
};
exports.AdminService = {
    login,
    getProfile,
    updateProfile,
    updatePassword,
    verifyPasswordUpdate,
};
