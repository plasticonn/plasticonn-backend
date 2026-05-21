"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenterManagement = exports.bulkAddCenters = void 0;
const centers_model_1 = require("../../centers/centers.model");
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const password_1 = require("../../../common/utils/password");
const sync_1 = require("csv-parse/sync");
const generateCode_1 = require("../../../common/utils/generateCode");
const Logs_service_1 = require("../../activity_logs/Logs.service");
const log = new logger_1.Logger("CenterManagement");
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};
const bulkAddCenters = async (file) => {
    const records = (0, sync_1.parse)(file.buffer.toString("utf-8"), {
        columns: (header) => header.map((h) => h.trim()),
        skip_empty_lines: true,
    });
    const inserted = [];
    let skipped = 0;
    for (const row of records) {
        try {
            if (!row.Latitude || !row.Longitude) {
                skipped++;
                continue;
            }
            const center = {
                centerId: (0, generateCode_1.generateCenterId)(),
                name: row.Center_Name,
                address: row.Address,
                gps: {
                    type: "Point",
                    coordinates: [Number(row.Longitude), Number(row.Latitude)],
                },
                contactPerson: row.Contact_Person,
                contactPhone: row.Phone,
                contactEmail: row.Email,
                materialsAccepted: row.Accepted_Plastic_Types?.split(",").map((m) => m.trim()),
                verified: true,
                type: row.Type,
                password: await password_1.passwordServices.hashPassword(generatePassword()),
            };
            const doc = await centers_model_1.CenterModel.create(center);
            inserted.push(doc);
        }
        catch (err) {
            console.log(err);
            skipped++;
            console.error("Skipped row:", row.Center_Name);
        }
    }
    await (0, Logs_service_1.addLog)({
        type: "CSV upload",
        admin: "Admin",
        action: `${inserted.length} centers have been uploaded and verified`,
    });
    return {
        totalRows: records.length,
        inserted: inserted.length,
        skipped,
    };
};
exports.bulkAddCenters = bulkAddCenters;
const getCenter = async (centerId) => {
    log.info("Fetching center profile");
    const center = await centers_model_1.CenterModel.findById(centerId).select("-password");
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    return { center };
};
const updateCenter = async (centerId, payload) => {
    log.info("Updating center profile");
    const center = await centers_model_1.CenterModel.findById(centerId);
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    Object.assign(center, payload);
    await center.save();
    return { center };
};
const updateStatus = async (centerId, status) => {
    log.info("Updating center status");
    const center = await centers_model_1.CenterModel.findById(centerId);
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    Object.assign(center, status);
    await (0, Logs_service_1.addLog)({
        type: "Status update",
        admin: "Super admin",
        action: `Center status has been updated to ${status}`,
        userId: centerId,
    });
    await center.save();
    return { center };
};
const verifyCenter = async (centerId, formal) => {
    log.info("Updating center status");
    const center = await centers_model_1.CenterModel.findById(centerId);
    if (!center)
        throw new HttpError_1.HttpError(404, "Center not found");
    Object.assign(center, { verified: true, formal: Boolean(formal) });
    await (0, Logs_service_1.addLog)({
        type: "Center Verified",
        admin: "Super admin",
        action: `A center has just been verified.`,
        userId: centerId,
    });
    await center.save();
    return { center };
};
const deleteCenter = async (centerId) => {
    log.info("Deleting center");
    const center = await centers_model_1.CenterModel.findByIdAndDelete(centerId);
    if (!center) {
        throw new HttpError_1.HttpError(404, "Center not found");
    }
    await (0, Logs_service_1.addLog)({
        type: "Account deletion",
        admin: "Admin",
        action: `Center account has been deleted by admin`,
        userId: centerId,
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
exports.CenterManagement = {
    bulkAddCenters: exports.bulkAddCenters,
    getCenter,
    updateCenter,
    updateStatus,
    verifyCenter,
    deleteCenter,
};
