"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenterService = void 0;
const roles_enum_1 = require("../../common/enum/roles.enum");
const logger_1 = require("../../common/logger/logger");
const HttpError_1 = require("../../common/utils/HttpError");
const password_1 = require("../../common/utils/password");
const centers_model_1 = require("./centers.model");
const config_1 = require("../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateCode_1 = require("../../common/utils/generateCode");
const Logs_service_1 = require("../activity_logs/Logs.service");
const drops_model_1 = require("../drops/drops.model");
const mongoose_1 = __importDefault(require("mongoose"));
const email_service_1 = require("../../common/email/email.service");
const templates_1 = require("../../common/email/templates");
const otp_1 = require("../../common/utils/otp/otp");
const cloudinary_1 = require("../../common/utils/cloudinary");
const log = new logger_1.Logger("CenterService");
const register = async (payload, files) => {
    log.info("Registering center");
    const parsedPayload = {
        ...payload,
        lng: Number(payload.lng),
        lat: Number(payload.lat),
        formal: payload.formal === "true",
        materialsAccepted: Array.isArray(payload.materialsAccepted)
            ? payload.materialsAccepted
            : JSON.parse(payload.materialsAccepted || "[]"),
    };
    const centerExists = await centers_model_1.CenterModel.findOne({ name: payload.name });
    if (centerExists)
        throw new HttpError_1.HttpError(409, "Center already exists");
    const centerId = (0, generateCode_1.generateCenterId)();
    const hashed = await password_1.passwordServices.hashPassword(payload.password);
    let image = null;
    let documents = [];
    if (files?.documents?.length) {
        const uploads = await Promise.all(files.documents.map(async (doc) => {
            const uploaded = await (0, cloudinary_1.uploadToCloudinary)(doc);
            return {
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
            };
        }));
        documents = uploads;
    }
    if (files?.image?.[0]) {
        const uploaded = await (0, cloudinary_1.uploadToCloudinary)(files.image[0]);
        image = {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
        };
    }
    const { lat, lng, password, ...rest } = parsedPayload;
    const center = await centers_model_1.CenterModel.create({
        ...rest,
        centerId,
        password: hashed,
        image,
        documents,
        gps: {
            type: "Point",
            coordinates: [lng, lat],
        },
    });
    const token = jsonwebtoken_1.default.sign({ sub: payload.email, role: roles_enum_1.Roles.CENTER }, config_1.config.jwtSecret, { expiresIn: "7d" });
    await (0, Logs_service_1.addLog)({
        type: "User registration",
        admin: null,
        action: `A new center ${payload.email} just registered`,
    });
    return { center, token };
};
const login = async (centerId, password) => {
    log.info("Logging in center");
    centerId = centerId.trim().toUpperCase();
    const center = await centers_model_1.CenterModel.findOne({ centerId });
    if (!center)
        throw new HttpError_1.HttpError(422, "Center not found");
    if (!center.verified)
        throw new HttpError_1.HttpError(403, "Center not verified");
    if (center.status === "suspended")
        throw new HttpError_1.HttpError(403, "Center is suspended");
    const match = await password_1.passwordServices.verifyPassword(password, String(center.password));
    if (!match)
        throw new HttpError_1.HttpError(422, "Invalid Password");
    const token = jsonwebtoken_1.default.sign({ sub: center._id, role: roles_enum_1.Roles.CENTER }, config_1.config.jwtSecret, { expiresIn: "7d" });
    // Sanitize response
    const { password: _, ...safeCenter } = center.toObject();
    return { center: safeCenter, token };
};
const getProfile = async (centerId) => {
    log.info("Fetching center profile");
    const center = await centers_model_1.CenterModel.findById(centerId).select("-password");
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    return { center };
};
const updateProfile = async (centerId, payload) => {
    log.info("Updating center profile");
    const center = await centers_model_1.CenterModel.findById(centerId);
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    Object.assign(center, payload);
    await center.save();
    return { center };
};
const deleteAccount = async (centerId) => {
    log.info("Deleting center");
    const center = await centers_model_1.CenterModel.findByIdAndDelete(centerId);
    if (!center) {
        throw new HttpError_1.HttpError(404, "Center not found");
    }
    await (0, Logs_service_1.addLog)({
        type: "Account deletion",
        admin: null,
        action: "A center has deleted their account",
        userId: centerId,
        userType: "Centers",
    });
    return { message: "Center deleted successfully" };
};
const getCenters = async () => {
    log.info("Getting all centers");
    const centers = await centers_model_1.CenterModel.find().select("-password");
    if (centers.length <= 0)
        throw new HttpError_1.HttpError(404, "No centers found");
    return { centers };
};
const getClosestCenters = async (lat, lng, limit = 5) => {
    log.info("Getting closest centers");
    const centers = await centers_model_1.CenterModel.find({
        gps: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
            },
        },
    })
        .select("-password")
        .limit(limit);
    if (centers.length <= 0)
        throw new HttpError_1.HttpError(404, "No centers found");
    return { centers };
};
const getCenterStats = async (center_id) => {
    log.info("get center stats");
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    const [verifiedDrops, pendingDrops, todayDrops, plasticsResult] = await Promise.all([
        // Verified drops
        drops_model_1.DropsModel.countDocuments({
            center_id,
            status: { $in: ["accepted", "verified"] },
        }),
        // Pending drops
        drops_model_1.DropsModel.countDocuments({
            center_id,
            status: "pending",
        }),
        // Today's drops
        drops_model_1.DropsModel.countDocuments({
            center_id,
            createdAt: {
                $gte: todayStart,
                $lte: todayEnd,
            },
        }),
        // Total plastics collected
        drops_model_1.DropsModel.aggregate([
            { $match: { center_id: new mongoose_1.default.Types.ObjectId(center_id) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]),
    ]);
    const totalPlastics = plasticsResult[0]?.total || 0;
    const CO2_PER_KG = 1.5; // kg of CO2 saved per kg of plastic recycled
    const AVG_PLASTIC_WEIGHT_KG = 0.01; // average weight of one plastic item (10g)
    const weightKg = totalPlastics * AVG_PLASTIC_WEIGHT_KG;
    const totalCO2Saved = weightKg * CO2_PER_KG;
    return {
        verifiedDrops,
        pendingDrops,
        todayDrops,
        totalCO2Saved,
    };
};
const updatePassword = async (center_id, payload) => {
    log.info("Change password");
    const center = await centers_model_1.CenterModel.findById(center_id);
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    const match = await password_1.passwordServices.verifyPassword(payload.curPassword, String(center.password));
    if (!match)
        throw new HttpError_1.HttpError(422, "Invalid password");
    const otp = otp_1.otpServices.generateOtp();
    await otp_1.otpServices.storeOtp(String(center.contactEmail), otp);
    await email_service_1.EmailService.sendEmail({
        to: String(center.contactEmail),
        subject: "Password Change Confirmation",
        html: (0, templates_1.changePasswordTemplate)({
            otp: otp,
        }),
    });
};
const verifyPasswordUpdate = async (center_id, payload) => {
    log.info("Verify password change");
    const center = await centers_model_1.CenterModel.findById(center_id);
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    const verify = await otp_1.otpServices.verifyOtp(String(center.contactEmail), payload.otp);
    if (verify.error) {
        throw new HttpError_1.HttpError(400, verify.error);
    }
    const password = await password_1.passwordServices.hashPassword(payload.newPassword);
    center.password = password;
    await center.save();
    return { center };
};
const updateProfilePicture = async (centerId, file) => {
    if (!file)
        throw new HttpError_1.HttpError(400, "Image is required");
    const uploaded = await (0, cloudinary_1.uploadToCloudinary)(file);
    const center = await centers_model_1.CenterModel.findByIdAndUpdate(centerId, {
        image: {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
        },
    }, { new: true });
    return center;
};
const removeProfilePicture = async (centerId) => {
    const center = await centers_model_1.CenterModel.findById(centerId);
    if (!center) {
        throw new HttpError_1.HttpError(404, "Center not found");
    }
    // If no image, nothing to delete
    if (!center.image || !center.image.public_id) {
        return center;
    }
    // Delete from Cloudinary
    await (0, cloudinary_1.deleteFromCloudinary)(center.image.public_id);
    // Remove from DB
    center.image = null;
    await center.save();
    return center;
};
exports.CenterService = {
    register,
    login,
    getProfile,
    updateProfile,
    deleteAccount,
    getCenters,
    getClosestCenters,
    getCenterStats,
    updatePassword,
    verifyPasswordUpdate,
    updateProfilePicture,
    removeProfilePicture,
};
