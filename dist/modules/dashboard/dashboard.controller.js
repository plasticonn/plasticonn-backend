"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
const dashboard_service_1 = require("./dashboard.service");
const log = new logger_1.Logger("DashboardController");
exports.DashboardController = (0, express_1.Router)();
/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned stats
 */
exports.DashboardController.get("/stats", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const result = await (0, dashboard_service_1.getDashboardStats)();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Data retrieved", result));
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
 * /api/admin/dashboard/graph:
 *   get:
 *     summary: Get plastic collection graph stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned graph stats
 */
exports.DashboardController.get("/graph", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const result = await (0, dashboard_service_1.yearlyPlasticCollection)();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Data retrieved", result));
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
 * /api/admin/dashboard/analytics:
 *   get:
 *     summary: Get plastic collection analytics stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned stats
 */
exports.DashboardController.get("/analytics", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const result = await (0, dashboard_service_1.getAnalyticsStats)();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Data retrieved", result));
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
