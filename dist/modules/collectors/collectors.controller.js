"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorController = void 0;
const express_1 = require("express");
const collectors_service_1 = require("./collectors.service");
const api_response_1 = require("../../common/responses/api-response");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const logger_1 = require("../../common/logger/logger");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const HttpError_1 = require("../../common/utils/HttpError");
const upload_middleware_1 = require("../../common/middleware/upload.middleware");
/**
 * @swagger
 * tags:
 *   name: Collector
 *   description: Collectors' endpoints
 */
const log = new logger_1.Logger("CollectorController");
exports.CollectorController = (0, express_1.Router)();
/**
 * @swagger
 * /api/collector/register:
 *   post:
 *     summary: Registers a collector
 *     tags: [Collector]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully registered
 */
exports.CollectorController.post("/register", upload_middleware_1.upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            throw new HttpError_1.HttpError(400, "Image file is required");
        }
        const result = await collectors_service_1.CollectorsService.register(req.body, req.file);
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.CREATED, "User registered", result));
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
 * /api/collector/login:
 *   post:
 *     summary: Logs in a collector
 *     tags: [Collector]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
exports.CollectorController.post("/login", async (req, res) => {
    try {
        const result = await collectors_service_1.CollectorsService.login(req.body.email, req.body.password);
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: true, // true in prod
            sameSite: "none",
        });
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.CREATED, "Login successful", result));
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
 * /api/collector/profile/{id}:
 *   get:
 *     summary: Gets collector profile
 *     tags: [Collector]
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
exports.CollectorController.get("/profile/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await collectors_service_1.CollectorsService.getProfile(id);
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
 * /api/collector/profile:
 *   put:
 *     summary: Update collector profile
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated profile
 */
exports.CollectorController.put("/profile", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const user_id = req.user.sub;
    const payload = req.body;
    try {
        const result = await collectors_service_1.CollectorsService.updateProfile(user_id, payload);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Profile updated", result));
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
 * /api/collector/delete:
 *   delete:
 *     summary: Delete collector account
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted account
 */
exports.CollectorController.delete("/delete", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const user_id = req.user.sub;
    try {
        const result = await collectors_service_1.CollectorsService.deleteAccount(user_id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Account deleted", result));
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
 * /api/collector/dashboard:
 *   get:
 *     summary: Gets collector stats
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return collector stats successfully
 */
exports.CollectorController.get("/dashboard", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const user_id = req.user.sub;
    try {
        const result = await collectors_service_1.CollectorsService.getDashboardStats(user_id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Collector stats returned", result));
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
 * /api/collector/update-password:
 *   post:
 *     summary: Update collector password
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               curPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
exports.CollectorController.post("/update-password", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const user_id = req.user.sub;
    const payload = req.body;
    try {
        const result = await collectors_service_1.CollectorsService.updatePassword(user_id, payload);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Password update initiated. Check mail for OTP.", result));
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
 * /api/collector/verify-password-update:
 *   put:
 *     summary: Verify password update
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
exports.CollectorController.put("/verify-password-update", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const user_id = req.user.sub;
    const payload = req.body;
    try {
        const result = await collectors_service_1.CollectorsService.verifyPasswordUpdate(user_id, payload);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Password updated successfully.", result));
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
 * /api/collector/picture:
 *   patch:
 *     summary: Update collector profile picture
 *     tags: [collector]
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
 *
 *     responses:
 *       200:
 *         description: Successfully updated collector picture
 */
exports.CollectorController.patch("/picture", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), upload_middleware_1.upload.single("image"), async (req, res) => {
    try {
        const user_id = req.user.sub;
        if (!req.file) {
            throw new HttpError_1.HttpError(400, "Image file is required");
        }
        const updated = await collectors_service_1.CollectorsService.updateProfilePicture(user_id, req.file);
        return res
            .status(200)
            .json((0, api_response_1.ApiResponse)(200, "collector picture updated successfully", updated));
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
 * /api/collector/picture:
 *   delete:
 *     summary: Delete collector picture
 *     tags: [collector]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted collector picture
 */
exports.CollectorController.delete("/picture", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    try {
        const user_id = req.user.sub;
        const updated = await collectors_service_1.CollectorsService.removeProfilePicture(user_id);
        return res
            .status(200)
            .json((0, api_response_1.ApiResponse)(200, "Profile picture removed successfully", updated));
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
