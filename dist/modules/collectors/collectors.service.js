"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorsService = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const collectors_model_1 = require("./collectors.model");
const config_1 = require("../../config");
const logger_1 = require("../../common/logger/logger");
const roles_enum_1 = require("../../common/enum/roles.enum");
const HttpError_1 = require("../../common/utils/HttpError");
const Logs_service_1 = require("../activity_logs/Logs.service");
const password_1 = require("../../common/utils/password");
const drops_model_1 = require("../drops/drops.model");
const co2saved_1 = require("../../common/utils/co2saved");
const email_service_1 = require("../../common/email/email.service");
const otp_1 = require("../../common/utils/otp/otp");
const templates_1 = require("../../common/email/templates");
const cloudinary_1 = require("../../common/utils/cloudinary");
const log = new logger_1.Logger("CollectorsService");
const register = async (payload, file) => {
    log.info("Registering collector");
    const collector = await collectors_model_1.CollectorsModel.findOne({ email: payload.email });
    if (collector)
        throw new HttpError_1.HttpError(409, "Collector already exists");
    const hashed = await password_1.passwordServices.hashPassword(payload.password);
    let image = null;
    if (file) {
        const uploaded = await (0, cloudinary_1.uploadToCloudinary)(file);
        image = {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    }
    const user = await collectors_model_1.CollectorsModel.create({
        ...payload,
        image,
        password: hashed,
    });
    await (0, Logs_service_1.addLog)({
        type: "User registration",
        admin: null,
        action: `A new collector ${payload.email} just registered`,
    });
    const token = jsonwebtoken_1.default.sign({ sub: payload.email, role: roles_enum_1.Roles.COLLECTOR }, config_1.config.jwtSecret, {
        expiresIn: "7d",
    });
    return { user, token };
};
exports.register = register;
const login = async (email, password) => {
    log.info("logging in collector");
    const user = await collectors_model_1.CollectorsModel.findOne({ email });
    if (!user)
        throw new HttpError_1.HttpError(404, "Collector does not exist");
    //const match = await bcrypt.compare(password, String(user.password));
    const match = await password_1.passwordServices.verifyPassword(password, String(user.password));
    if (!match)
        throw new HttpError_1.HttpError(422, "Invalid password");
    const token = jsonwebtoken_1.default.sign({ sub: user._id, role: roles_enum_1.Roles.COLLECTOR }, config_1.config.jwtSecret, {
        expiresIn: "7d",
    });
    return { user, token };
};
exports.login = login;
const getProfile = async (collectorId) => {
    log.info("Fetching collector profile");
    const collector = await collectors_model_1.CollectorsModel.findById(collectorId).select("-password");
    if (!collector)
        throw new HttpError_1.HttpError(404, "Collector not found");
    return { collector };
};
const updateProfile = async (collectorId, payload) => {
    log.info("Updating collector profile");
    const collector = await collectors_model_1.CollectorsModel.findById(collectorId);
    if (!collector)
        throw new HttpError_1.HttpError(404, "Collector not found");
    Object.assign(collector, payload);
    await collector.save();
    return { collector };
};
const deleteAccount = async (collectorId) => {
    log.info("Deleting collector");
    const collector = await collectors_model_1.CollectorsModel.findByIdAndDelete(collectorId);
    if (!collector) {
        throw new HttpError_1.HttpError(404, "Collector not found");
    }
    await (0, Logs_service_1.addLog)({
        type: "Account deletion",
        admin: null,
        action: "A collector has deleted their account",
        userId: collectorId,
    });
    return { message: "Account deleted successfully" };
};
const getDashboardStats = async (user_id) => {
    log.info("Getting collector stats");
    // 1. get user drops
    const drops = await drops_model_1.DropsModel.find({ collector_id: user_id });
    const totalPlastics = drops.reduce((sum, drop) => sum + (drop.amount || 0), 0);
    const co2Saved = (0, co2saved_1.calculateCO2Saved)(totalPlastics);
    const verifiedSubmissions = drops.filter((drop) => drop.status === "verified" || drop.status === "accepted").length;
    const totalSubmissions = drops.length;
    const leaderboard = await drops_model_1.DropsModel.aggregate([
        {
            $match: {
                status: { $in: ["accepted", "verified"] },
            },
        },
        {
            $group: {
                _id: "$collector_id",
                totalPlastics: { $sum: "$amount" },
            },
        },
        {
            $sort: { totalPlastics: -1 },
        },
    ]);
    const rankIndex = leaderboard.findIndex((item) => item._id.toString() === user_id);
    const rank = rankIndex === -1 ? null : rankIndex + 1;
    return {
        co2Saved,
        verifiedSubmissions,
        totalSubmissions,
        totalPlastics,
        rank,
    };
};
const updatePassword = async (collector_id, payload) => {
    log.info("Change password");
    const collector = await collectors_model_1.CollectorsModel.findById(collector_id);
    if (!collector)
        throw new HttpError_1.HttpError(404, "Collector not found");
    const match = await password_1.passwordServices.verifyPassword(payload.curPassword, String(collector.password));
    if (!match)
        throw new HttpError_1.HttpError(422, "Invalid password");
    const otp = otp_1.otpServices.generateOtp();
    await otp_1.otpServices.storeOtp(String(collector.email), otp);
    await email_service_1.EmailService.sendEmail({
        to: String(collector.email),
        subject: "Password Change Confirmation",
        html: (0, templates_1.changePasswordTemplate)({
            otp: otp,
        }),
    });
};
const verifyPasswordUpdate = async (collector_id, payload) => {
    log.info("Verify password change");
    const collector = await collectors_model_1.CollectorsModel.findById(collector_id);
    if (!collector)
        throw new HttpError_1.HttpError(404, "Collector not found");
    const verify = await otp_1.otpServices.verifyOtp(String(collector.email), payload.otp);
    if (verify.error) {
        throw new HttpError_1.HttpError(400, verify.error);
    }
    const password = await password_1.passwordServices.hashPassword(payload.newPassword);
    collector.password = password;
    await collector.save();
    return { collector };
};
const updateProfilePicture = async (centerId, file) => {
    if (!file)
        throw new HttpError_1.HttpError(400, "Image is required");
    const uploaded = await (0, cloudinary_1.uploadToCloudinary)(file);
    const center = await collectors_model_1.CollectorsModel.findByIdAndUpdate(centerId, {
        image: {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
        },
    }, { new: true });
    return center;
};
const removeProfilePicture = async (collectorId) => {
    const collector = await collectors_model_1.CollectorsModel.findById(collectorId);
    if (!collector) {
        throw new HttpError_1.HttpError(404, "collector not found");
    }
    // If no image, nothing to delete
    if (!collector.image || !collector.image.public_id) {
        return collector;
    }
    // Delete from Cloudinary
    await (0, cloudinary_1.deleteFromCloudinary)(collector.image.public_id);
    // Remove from DB
    collector.image = null;
    await collector.save();
    return collector;
};
exports.CollectorsService = {
    register: exports.register,
    login: exports.login,
    getProfile,
    updateProfile,
    deleteAccount,
    getDashboardStats,
    updatePassword,
    verifyPasswordUpdate,
    updateProfilePicture,
    removeProfilePicture,
};
