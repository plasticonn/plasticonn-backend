"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const password_1 = require("../../../common/utils/password");
const Logs_service_1 = require("../../activity_logs/Logs.service");
const admin_model_1 = require("../admin.model");
const log = new logger_1.Logger("adminManagement");
const addAdmin = async (payload) => {
    log.info("Adding admin");
    const adminExists = await admin_model_1.AdminModel.findOne({ email: payload.email });
    if (adminExists)
        throw new HttpError_1.HttpError(409, "Admin already added");
    //const password = passwordServices.generatePassword(6);
    console.log(payload.password);
    const hashed = await password_1.passwordServices.hashPassword(payload.password);
    const admin = await admin_model_1.AdminModel.create({
        ...payload,
        //password: hashed,
    });
    // await EmailService.sendEmail({
    //   to: payload.email,
    //   subject: "Admin Invite",
    //   html: adminInviteTemplate({
    //     name: payload.name,
    //     password: password,
    //   }),
    // });
    return { admin };
};
const getAdmin = async (adminId) => {
    log.info("Fetching admin profile");
    const admin = await admin_model_1.AdminModel.findById(adminId).select("-password");
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin not found");
    return { admin };
};
const updateAdmin = async (adminId, payload) => {
    log.info("Updating admin profile");
    const admin = await admin_model_1.AdminModel.findById(adminId);
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin not found");
    Object.assign(admin, payload);
    await admin.save();
    return { admin };
};
const updateStatus = async (adminId, status) => {
    log.info("Updating admin status");
    const admin = await admin_model_1.AdminModel.findById(adminId);
    if (!admin)
        throw new HttpError_1.HttpError(404, "Admin not found");
    await (0, Logs_service_1.addLog)({
        type: "Status update",
        admin: "Super admin",
        action: `Admin status has been updated to ${status}`,
        userId: adminId,
        userType: "Admins",
    });
    Object.assign(admin, status);
    await admin.save();
    return { admin };
};
const removeAdmin = async (adminId) => {
    log.info("Deleting admin");
    const admin = await admin_model_1.AdminModel.findByIdAndDelete(adminId);
    if (!admin) {
        throw new HttpError_1.HttpError(404, "Admin not found");
    }
    return { message: "Admin deleted successfully" };
};
const getAdmins = async () => {
    log.info("Getting all admin");
    const admins = await admin_model_1.AdminModel.find().select("-password");
    if (admins.length <= 0)
        throw new HttpError_1.HttpError(404, "No admins found");
    return { admins };
};
exports.adminServices = {
    addAdmin,
    getAdmin,
    getAdmins,
    updateAdmin,
    updateStatus,
    removeAdmin,
};
