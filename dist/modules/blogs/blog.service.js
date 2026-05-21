"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const cloudinary_1 = require("../../common/utils/cloudinary");
const HttpError_1 = require("../../common/utils/HttpError");
const blog_model_1 = require("./blog.model");
const getBlogs = async () => {
    return await blog_model_1.BlogModel.find();
};
const addBlog = async (file, payload) => {
    if (!file)
        throw new HttpError_1.HttpError(400, "Logo required");
    const uploaded = await (0, cloudinary_1.uploadToCloudinary)(file);
    return await blog_model_1.BlogModel.create({
        ...payload,
        image: {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
        },
    });
};
const removeBlog = async (id) => {
    const blog = await blog_model_1.BlogModel.findById(id);
    if (!blog)
        throw new HttpError_1.HttpError(404, "Blog not found");
    if (blog.image?.public_id) {
        await (0, cloudinary_1.deleteFromCloudinary)(blog.image.public_id);
    }
    await blog.deleteOne();
    return { message: "Blog removed" };
};
const publishBlog = async (id) => {
    const blog = await blog_model_1.BlogModel.findByIdAndUpdate(id, {
        status: "published",
    }, { new: true });
    return { message: "Blog published" };
};
exports.BlogService = {
    getBlogs,
    addBlog,
    removeBlog,
    publishBlog,
};
