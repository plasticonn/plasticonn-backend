"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const auth_service_1 = require("./auth.service");
const api_response_1 = require("../../common/responses/api-response");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const logger_1 = require("../../common/logger/logger");
const HttpError_1 = require("../../common/utils/HttpError");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const log = new logger_1.Logger("AuthController");
exports.AuthController = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Initiates password reset flow
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset initiated
 */
exports.AuthController.post("/forget-password", async (req, res) => {
    try {
        const { email } = req.body;
        const result = await auth_service_1.AuthServices.forgotPassword(email);
        return res.status(http_status_enum_1.HttpStatus.OK).json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, result));
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
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
exports.AuthController.post("/logout", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin", "center", "collector"]), async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Logout successfull"));
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
 * /api/auth/confirm-password-reset:
 *   post:
 *     summary: Confirms password reset operation via OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset confirmed
 */
exports.AuthController.post("/confirm-password-reset", async (req, res) => {
    try {
        const { email, otp_code } = req.body;
        const result = await auth_service_1.AuthServices.confirmPasswordReset(email, otp_code);
        return res.status(http_status_enum_1.HttpStatus.OK).json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, result));
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
 * /api/auth/reset-password:
 *   post:
 *     summary: Resets user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp_code:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
exports.AuthController.post("/reset-password", async (req, res) => {
    try {
        const { email, otp_code, password } = req.body;
        const result = await auth_service_1.AuthServices.resetPassword(email, otp_code, password);
        return res.status(http_status_enum_1.HttpStatus.OK).json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, result));
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
 * /api/auth/update-password:
 *   post:
 *     summary: Update user password
 *     tags: [Auth]
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
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
exports.AuthController.post("/update-password", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector", "center"]), async (req, res) => {
    const user_id = req.user.sub;
    const { curPassword, role } = req.body;
    try {
        const result = await auth_service_1.AuthServices.changePassword(user_id, curPassword, role);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Password update initiated. Check mail for OTP.", result));
    }
    catch (err) {
        log.error(err.message);
        console.log(err);
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
 * /api/auth/verify-password-update:
 *   put:
 *     summary: Verify password update
 *     tags: [Auth]
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
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
exports.AuthController.put("/verify-password-update", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector", "center"]), async (req, res) => {
    const user_id = req.user.sub;
    const { role, ...payload } = req.body;
    try {
        const result = await auth_service_1.AuthServices.verifyPasswordUpdate(user_id, payload, role);
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
