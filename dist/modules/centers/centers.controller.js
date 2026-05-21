"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenterController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const centers_service_1 = require("./centers.service");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const upload_middleware_1 = require("../../common/middleware/upload.middleware");
/**
 * @swagger
 * tags:
 *   name: Center
 *   description: Centers' endpoints
 */
const log = new logger_1.Logger("CenterController");
exports.CenterController = (0, express_1.Router)();
/**
 * @swagger
 * /api/center/register:
 *   post:
 *     summary: Register a center (i.e recycling or collection)
 *     tags: [Center]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               lng:
 *                 type: number
 *               lat:
 *                 type: number
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               centerType:
 *                 type: string
 *               formal:
 *                 type: boolean
 *               materialsAccepted:
 *                 type: array
 *                 items:
 *                   type: string
 *               capacity:
 *                 type: string
 *               operatingHours:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               document:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Successfully registered
 */
exports.CenterController.post("/register", upload_middleware_1.upload.fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 5 },
]), async (req, res) => {
    try {
        const result = await centers_service_1.CenterService.register(req.body, req.files);
        res.clearCookie("token");
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.CREATED, "Center registered successfully", result));
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
 * /api/center/login:
 *   post:
 *     summary: Logs in a center (i.e recylcing or collection)
 *     tags: [Center]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               centerId:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Login successful
 */
exports.CenterController.post("/login", async (req, res) => {
    try {
        const result = await centers_service_1.CenterService.login(req.body.centerId, req.body.password);
        res.clearCookie("token");
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
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
/**
 * @swagger
 * /api/center/profile/{id}:
 *   get:
 *     summary: Gets center profile
 *     tags: [Center]
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
exports.CenterController.get("/profile/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await centers_service_1.CenterService.getProfile(id);
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
 * /api/center/profile:
 *   put:
 *     summary: Update center profile
 *     tags: [Center]
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
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               materialsAccepted:
 *                 type: array
 *                 items:
 *                   type: string
 *               capacity:
 *                 type: string
 *               operatingHours:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated profile
 */
exports.CenterController.put("/profile", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    const user_id = req.user.sub;
    const payload = req.body;
    try {
        const result = await centers_service_1.CenterService.updateProfile(user_id, payload);
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
 * /api/center/delete:
 *   delete:
 *     summary: Delete center account
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted center
 */
exports.CenterController.delete("/delete", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    const user_id = req.user.sub;
    try {
        const result = await centers_service_1.CenterService.deleteAccount(user_id);
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
 * /api/center/list:
 *   get:
 *     summary: Gets centers list
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List centers successfully
 */
exports.CenterController.get("/list", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector", "admin", "super_admin"]), async (req, res) => {
    try {
        const result = await centers_service_1.CenterService.getCenters();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Centers List returned", result));
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
 * /api/center/closest:
 *   get:
 *     summary: Gets closest centers list
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the user
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the user
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Number of centers to return (default 5)
 *     responses:
 *       200:
 *         description: List closest centers successfully
 */
exports.CenterController.get("/closest", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["collector"]), async (req, res) => {
    const { lat, lng } = req.query;
    try {
        const result = await centers_service_1.CenterService.getClosestCenters(Number(lat), Number(lng));
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Closest centers list returned", result));
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
 * /api/center/dashboard:
 *   get:
 *     summary: Gets center stats
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return center stats successfully
 */
exports.CenterController.get("/dashboard", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    const user_id = req.user.sub;
    try {
        const result = await centers_service_1.CenterService.getCenterStats(user_id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Center stats returned", result));
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
 * /api/center/update-password:
 *   post:
 *     summary: Update center password
 *     tags: [Admin]
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
exports.CenterController.post("/update-password", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    const user_id = req.user.sub;
    const payload = req.body;
    try {
        const result = await centers_service_1.CenterService.updatePassword(user_id, payload);
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
 * /api/center/verify-password-update:
 *   put:
 *     summary: Verify password update
 *     tags: [Center]
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
exports.CenterController.put("/verify-password-update", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    const user_id = req.user.sub;
    const payload = req.body;
    try {
        const result = await centers_service_1.CenterService.verifyPasswordUpdate(user_id, payload);
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
 * /api/center/picture:
 *   patch:
 *     summary: Update center profile picture
 *     tags: [Center]
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
 *         description: Successfully updated center picture
 */
exports.CenterController.patch("/picture", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), upload_middleware_1.upload.single("image"), async (req, res) => {
    try {
        const user_id = req.user.sub;
        if (!req.file) {
            throw new HttpError_1.HttpError(400, "Image file is required");
        }
        const updated = await centers_service_1.CenterService.updateProfilePicture(user_id, req.file);
        return res
            .status(200)
            .json((0, api_response_1.ApiResponse)(200, "Center picture updated successfully", updated));
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
 * /api/center/picture:
 *   delete:
 *     summary: Delete center picture
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted center picture
 */
exports.CenterController.delete("/picture", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["center"]), async (req, res) => {
    try {
        const user_id = req.user.sub;
        const updated = await centers_service_1.CenterService.removeProfilePicture(user_id);
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
