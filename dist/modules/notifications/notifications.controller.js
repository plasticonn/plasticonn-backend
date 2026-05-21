"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const notifications_service_1 = require("./notifications.service");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications' endpoints
 */
const log = new logger_1.Logger("NotificationController");
exports.NotificationController = (0, express_1.Router)();
/**
 * @swagger
 * /api/notification/list:
 *   get:
 *     summary: Gets user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications returned successfully
 */
exports.NotificationController.get("/list", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector", "center"]), async (req, res) => {
    const user_id = req.user.sub;
    try {
        const result = await notifications_service_1.NotificationsService.getNotifications(user_id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Notifications returned", result));
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
 * /api/notification/read/{id}:
 *   put:
 *     summary: Update notification status
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to update
 *     responses:
 *       200:
 *         description: Successfully updated notification
 */
exports.NotificationController.put("/read/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await notifications_service_1.NotificationsService.readNotification(id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Notification updated", result));
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
 * /api/notification/read:
 *   put:
 *     summary: Read all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated notifications
 */
exports.NotificationController.put("/read", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector", "center"]), async (req, res) => {
    const user_id = req.user.sub;
    try {
        const result = await notifications_service_1.NotificationsService.readAllNotifications(user_id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Notifications updated", result));
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
