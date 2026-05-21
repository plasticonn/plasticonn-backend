"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEmailController = void 0;
const express_1 = require("express");
const admin_email_service_1 = require("../services/admin-email.service");
const auth_middleware_1 = require("../../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../../common/middleware/role.middleware");
const api_response_1 = require("../../../common/responses/api-response");
const http_status_enum_1 = require("../../../common/enum/http-status.enum");
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const log = new logger_1.Logger("AdminEmailController");
exports.AdminEmailController = (0, express_1.Router)();
/**
 * @swagger
 * /api/admin/bulk-email:
 *   post:
 *     summary: Send bulk email to users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [audience, subject, message]
 *             properties:
 *               audience:
 *                 type: string
 *                 enum: [all, admins, collectors, centers]
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Emails sent successfully
 */
exports.AdminEmailController.post("/bulk-email", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const { audience, subject, message } = req.body;
        const result = await admin_email_service_1.AdminEmailService.sendBulkEmail({
            audience,
            subject,
            message,
        });
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Emails sent", result));
    }
    catch (err) {
        console.log(err);
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res
                .status(err.status)
                .json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
