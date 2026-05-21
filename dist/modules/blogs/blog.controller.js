"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const upload_middleware_1 = require("../../common/middleware/upload.middleware");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const blog_service_1 = require("./blog.service");
/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs endpoints
 */
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Gets blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 */
const log = new logger_1.Logger("BlogController");
exports.BlogController = (0, express_1.Router)();
exports.BlogController.get("/", async (req, res) => {
    try {
        const data = await blog_service_1.BlogService.getBlogs();
        res.json((0, api_response_1.ApiResponse)(200, "Blogs fetched", data));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Add blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added blog
 */
exports.BlogController.post("/", upload_middleware_1.upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            throw new HttpError_1.HttpError(400, "Image file is required");
        }
        const blog = await blog_service_1.BlogService.addBlog(req.file, req.body);
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(201, "Blog added", blog));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to remove
 *     responses:
 *       200:
 *         description: Successfully removed blog
 */
exports.BlogController.delete("/:id", async (req, res) => {
    try {
        const result = await blog_service_1.BlogService.removeBlog(req.params.id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(201, "Blog removed", result.message));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
/**
 * @swagger
 * /api/blog/{id}:
 *   patch:
 *     summary: Publish blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to publish
 *     responses:
 *       200:
 *         description: Successfully published blog
 */
exports.BlogController.patch("/:id", async (req, res) => {
    try {
        const result = await blog_service_1.BlogService.publishBlog(req.params.id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(201, "Blog published", result.message));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
