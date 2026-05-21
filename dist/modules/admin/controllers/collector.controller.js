"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorManagementController = void 0;
const express_1 = require("express");
const api_response_1 = require("../../../common/responses/api-response");
const http_status_enum_1 = require("../../../common/enum/http-status.enum");
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const auth_middleware_1 = require("../../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../../common/middleware/role.middleware");
const collector_service_1 = require("../services/collector.service");
/**
 * @swagger
 * tags:
 *   name: Collector Management
 *   description: Collector management endpoints for admins
 */
const log = new logger_1.Logger("CollectorManagementController");
exports.CollectorManagementController = (0, express_1.Router)();
/**
 * @swagger
 * /api/admin/collector-mgt/profile/{id}:
 *   get:
 *     summary: Gets collector profile
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to return
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
exports.CollectorManagementController.get("/profile/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await collector_service_1.CollectorServices.getCollector(id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Profile returned", result));
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
 * /api/admin/collector-mgt/list:
 *   get:
 *     summary: Gets list of collectors
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collectors list retrieved successfully
 */
exports.CollectorManagementController.get("/list", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const result = await collector_service_1.CollectorServices.getCollectors();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "List returned", result));
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
 * /api/admin/collector-mgt/update/{id}:
 *   put:
 *     summary: Update collector details
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully updated collector details
 */
exports.CollectorManagementController.put("/update/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        const result = await collector_service_1.CollectorServices.updateCollector(id, payload);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Collector details updated", result));
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
 * /api/admin/collector-mgt/status/{id}:
 *   put:
 *     summary: Update collector status
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to update
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
 *         description: Successfully updated collector status
 */
exports.CollectorManagementController.put("/status/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    const status = req.body;
    try {
        const result = await collector_service_1.CollectorServices.updateStatus(id, status);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Status updated", result));
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
 * /api/admin/collector-mgt/delete/{id}:
 *   delete:
 *     summary: Delete collector account
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to delete
 *     responses:
 *       200:
 *         description: Successfully deleted collector
 */
exports.CollectorManagementController.delete("/delete/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await collector_service_1.CollectorServices.deleteCollector(id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Collector deleted", result));
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
