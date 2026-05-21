"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const upload_middleware_1 = require("../../common/middleware/upload.middleware");
const api_response_1 = require("../../common/responses/api-response");
const gallery_service_1 = require("./gallery.service");
const HttpError_1 = require("../../common/utils/HttpError");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Gallery endpoints
 */
const log = new logger_1.Logger("GalleryController");
exports.GalleryController = (0, express_1.Router)();
/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Gets gallery
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Gallery retrieved successfully
 */
exports.GalleryController.get("/", async (req, res) => {
    try {
        const data = await gallery_service_1.GalleryService.getGallery();
        res.json((0, api_response_1.ApiResponse)(200, "Gallery fetched", data));
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
 * /api/gallery:
 *   post:
 *     summary: Add photos to gallery
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               event:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added photos
 */
exports.GalleryController.post("/", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["super_admin", "admin"]), upload_middleware_1.upload.array("images"), async (req, res) => {
    try {
        const result = await gallery_service_1.GalleryService.addPhoto(req.files, req.body.event);
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(201, "Photo added", result));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res
                .status(err.status)
                .json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete photo from gallery
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the photo to delete
 *     responses:
 *       200:
 *         description: Successfully deleted photo
 */
exports.GalleryController.delete("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["super_admin", "admin"]), async (req, res) => {
    try {
        const result = await gallery_service_1.GalleryService.removePhoto(req.params.id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(201, "Photo deleted", result));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res
                .status(err.status)
                .json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
