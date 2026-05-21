"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerService = void 0;
const cloudinary_1 = require("../../common/utils/cloudinary");
const HttpError_1 = require("../../common/utils/HttpError");
const partners_model_1 = require("./partners.model");
const getPartners = async () => {
    return await partners_model_1.PartnersModel.find();
};
const addPartner = async (file, name) => {
    if (!file)
        throw new HttpError_1.HttpError(400, "Logo required");
    const uploaded = await (0, cloudinary_1.uploadToCloudinary)(file);
    return await partners_model_1.PartnersModel.create({
        name,
        logo: {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
        },
    });
};
const removePartner = async (id) => {
    const partner = await partners_model_1.PartnersModel.findById(id);
    if (!partner)
        throw new HttpError_1.HttpError(404, "Partner not found");
    if (partner.logo?.public_id) {
        await (0, cloudinary_1.deleteFromCloudinary)(partner.logo.public_id);
    }
    await partner.deleteOne();
    return { message: "Partner removed" };
};
exports.PartnerService = {
    getPartners,
    addPartner,
    removePartner,
};
