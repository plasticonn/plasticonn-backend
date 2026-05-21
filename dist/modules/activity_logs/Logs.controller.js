"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
const Logs_service_1 = require("./Logs.service");
/**
 * @swagger
 * tags:
 *   name: Activity & Logs
 *   description: Activity and Logs endpoints
 */
const log = new logger_1.Logger("AdminManagementController");
exports.LogsController = (0, express_1.Router)();
/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Gets logs
 *     tags: [Activity & Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 */
exports.LogsController.get("/logs", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const result = await (0, Logs_service_1.getLogs)();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Logs returned", result));
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
