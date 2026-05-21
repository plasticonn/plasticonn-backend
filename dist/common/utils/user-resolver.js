"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = void 0;
const collectors_model_1 = require("../../modules/collectors/collectors.model");
const centers_model_1 = require("../../modules/centers/centers.model");
const admin_model_1 = require("../../modules/admin/admin.model");
const findUserByEmail = async (email) => {
    const collector = await collectors_model_1.CollectorsModel.findOne({ email });
    if (collector)
        return collector;
    const center = await centers_model_1.CenterModel.findOne({ contactEmail: email });
    if (center)
        return center;
    const admin = await admin_model_1.AdminModel.findOne({ email });
    if (admin)
        return admin;
    return null;
};
exports.findUserByEmail = findUserByEmail;
