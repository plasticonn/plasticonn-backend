"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminManagementController = void 0;
const express_1 = require("express");
const api_response_1 = require("../../../common/responses/api-response");
const http_status_enum_1 = require("../../../common/enum/http-status.enum");
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const auth_middleware_1 = require("../../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../../common/middleware/role.middleware");
const admin_mgt_service_1 = require("../services/admin-mgt.service");
/**
 * @swagger
 * tags:
 *   name: Admin Management
 *   description: Admin management endpoints for admins
 */
const log = new logger_1.Logger("AdminManagementController");
exports.AdminManagementController = (0, express_1.Router)();
/**
 * @swagger
 * /api/admin/admin-mgt/add:
 *   post:
 *     summary: Add an admin
 *     tags: [Admin Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Successfully registered
 */
exports.AdminManagementController.post("/add", async (req, res) => {
    try {
        const result = await admin_mgt_service_1.adminServices.addAdmin(req.body);
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.CREATED, "Admin added", result));
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
 * /api/admin/admin-mgt/profile/{id}:
 *   get:
 *     summary: Gets admin profile
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to return
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
exports.AdminManagementController.get("/profile/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await admin_mgt_service_1.adminServices.getAdmin(id);
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
 * /api/admin/admin-mgt/list:
 *   get:
 *     summary: Gets list of admin
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admins list retrieved successfully
 */
exports.AdminManagementController.get("/list", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const result = await admin_mgt_service_1.adminServices.getAdmins();
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
 * /api/admin/admin-mgt/update/{id}:
 *   put:
 *     summary: Update admin details
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully updated admin details
 */
exports.AdminManagementController.put("/update/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["super_admin"]), async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        const result = await admin_mgt_service_1.adminServices.updateAdmin(id, payload);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Admin details updated", result));
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
 * /api/admin/admin-mgt/status/{id}:
 *   put:
 *     summary: Update admin status
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to update
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
 *         description: Successfully updated admin status profile
 */
exports.AdminManagementController.put("/status/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["super_admin"]), async (req, res) => {
    const { id } = req.params;
    const status = req.body;
    try {
        const result = await admin_mgt_service_1.adminServices.updateStatus(id, status);
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
 * /api/admin/admin-mgt/delete/{id}:
 *   delete:
 *     summary: Delete admin account
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to delete
 *     responses:
 *       200:
 *         description: Successfully deleted admin
 */
exports.AdminManagementController.delete("/delete/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["super_admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await admin_mgt_service_1.adminServices.removeAdmin(id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Admin deleted", result));
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
