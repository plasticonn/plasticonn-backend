"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropController = void 0;
const express_1 = require("express");
const drops_service_1 = require("./drops.service");
const api_response_1 = require("../../common/responses/api-response");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const logger_1 = require("../../common/logger/logger");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const HttpError_1 = require("../../common/utils/HttpError");
const notifications_service_1 = require("../notifications/notifications.service");
const upload_middleware_1 = require("../../common/middleware/upload.middleware");
/**
 * @swagger
 * tags:
 *   name: Drops
 *   description: Drops' endpoints
 */
const log = new logger_1.Logger("DropControllers");
exports.DropController = (0, express_1.Router)();
/**
 * @swagger
 * /api/drop/add:
 *   post:
 *     summary: Adds a drop off
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               types:
 *                 types: string
 *               center_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               condition:
 *                 type: string
 *               lng:
 *                 type: number
 *               lat:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Drop off successful
 */
exports.DropController.post("/add", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), upload_middleware_1.upload.single("image"), async (req, res) => {
    try {
        const user_id = req.user.sub;
        const result = await drops_service_1.DropsService.addDrop(user_id, req.body, req.file);
        const payload = {
            title: "Confirmation Notification",
            message: "Your drop-off request has been submitted successfully.",
        };
        await notifications_service_1.NotificationsService.sendNotification(user_id, payload, "individual");
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.CREATED, "Drop off successful", result));
    }
    catch (err) {
        log.error(err.message);
        return res
            .status(http_status_enum_1.HttpStatus.BAD_REQUEST)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.BAD_REQUEST, err.message));
    }
});
/**
 * @swagger
 * /api/drop/get:
 *   get:
 *     summary: Gets list of drop offs for user
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved drop list
 */
exports.DropController.get("/get", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector", "center"]), async (req, res) => {
    try {
        const userId = req.user.sub;
        const result = await drops_service_1.DropsService.getDropList(userId);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Drops fetched successfully", result));
    }
    catch (err) {
        log.error(err.message);
        const status = err.statusCode || http_status_enum_1.HttpStatus.BAD_REQUEST;
        return res.status(status).json((0, api_response_1.ApiResponse)(status, err.message));
    }
});
/**
 * @swagger
 * /api/drop/detail/{id}:
 *   get:
 *     summary: Gets drop details
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the drop to return
 *     responses:
 *       200:
 *         description: Drop detail retrieved successfully
 */
exports.DropController.get("/detail/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector", "center"]), async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.sub;
        const result = await drops_service_1.DropsService.getDropById(id, user_id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Drop detail returned", result));
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
 * /api/drop/update/{id}:
 *   put:
 *     summary: Updates drop off status
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the drop to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated drop off
 */
exports.DropController.put("/update/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.sub;
    try {
        const result = await drops_service_1.DropsService.updateDrop(id, user_id, status);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Drop off updated", result));
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
