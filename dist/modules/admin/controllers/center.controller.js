"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenterManagementController = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const center_service_1 = require("../services/center.service");
const api_response_1 = require("../../../common/responses/api-response");
const http_status_enum_1 = require("../../../common/enum/http-status.enum");
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const auth_middleware_1 = require("../../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../../common/middleware/role.middleware");
const centers_service_1 = require("../../centers/centers.service");
/**
 * @swagger
 * tags:
 *   name: Center Management
 *   description: Center management endpoints for admins
 */
const log = new logger_1.Logger("CenterManagementController");
exports.CenterManagementController = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * @swagger
 * /api/admin/center-mgt/add:
 *   post:
 *     summary: Bulk add centers via file upload
 *     tags: [Center Management]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Centers added successfully
 */
exports.CenterManagementController.post("/add", 
// verifyToken,
// checkRole(["admin", "super_admin"]),
upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            throw new HttpError_1.HttpError(400, "File is required");
        }
        const result = await center_service_1.CenterManagement.bulkAddCenters(req.file);
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.CREATED, "Centers added", result));
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
 * /api/admin/center-mgt/profile/{id}:
 *   get:
 *     summary: Gets center profile
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to return
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
exports.CenterManagementController.get("/profile/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await center_service_1.CenterManagement.getCenter(id);
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
 * /api/admin/center-mgt/update/{id}:
 *   put:
 *     summary: Update center details
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully updated center details
 */
exports.CenterManagementController.put("/update/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        const result = await center_service_1.CenterManagement.updateCenter(id, payload);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Center details updated", result));
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
 * /api/admin/center-mgt/status/{id}:
 *   put:
 *     summary: Update center status
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to update
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
 *         description: Successfully updated center status
 */
exports.CenterManagementController.put("/status/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await center_service_1.CenterManagement.updateStatus(id, status);
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
 * /api/admin/center-mgt/verify/{id}:
 *   put:
 *     summary: Verify center
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to verify
 *     responses:
 *       200:
 *         description: Successfully verified center
 */
exports.CenterManagementController.put("/verify/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    const formal = req.body;
    try {
        const result = await center_service_1.CenterManagement.verifyCenter(id, formal);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Center verified", result));
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
 * /api/admin/center-mgt/delete/{id}:
 *   delete:
 *     summary: Delete center account
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to delete
 *     responses:
 *       200:
 *         description: Successfully deleted center
 */
exports.CenterManagementController.delete("/delete/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await center_service_1.CenterManagement.deleteCenter(id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Center deleted", result));
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
 * /api/admin/center-mgt/list:
 *   get:
 *     summary: Gets list of centers
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Centers list retrieved successfully
 */
exports.CenterManagementController.get("/list", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const result = await centers_service_1.CenterService.getCenters();
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
