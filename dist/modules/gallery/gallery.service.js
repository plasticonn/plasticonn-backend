"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const cloudinary_1 = require("../../common/utils/cloudinary");
const HttpError_1 = require("../../common/utils/HttpError");
const gallery_model_1 = require("./gallery.model");
const getGallery = async () => {
    return await gallery_model_1.GalleryModel.find().sort({ timestamp: -1 });
};
const addPhoto = async (files, event) => {
    if (!files || files.length === 0) {
        throw new HttpError_1.HttpError(400, "No images provided");
    }
    const uploads = await Promise.all(files.map(async (file) => {
        const uploaded = await (0, cloudinary_1.uploadToCloudinary)(file);
        return {
            image: {
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
            },
            event,
            timestamp: new Date(),
        };
    }));
    const photos = await gallery_model_1.GalleryModel.insertMany(uploads);
    return photos;
};
const removePhoto = async (id) => {
    const photo = await gallery_model_1.GalleryModel.findById(id);
    if (!photo)
        throw new HttpError_1.HttpError(404, "Photo not found");
    if (photo.image?.public_id) {
        await (0, cloudinary_1.deleteFromCloudinary)(photo.image.public_id);
    }
    await photo.deleteOne();
    return { message: "Photo removed" };
};
exports.GalleryService = {
    getGallery,
    addPhoto,
    removePhoto,
};
