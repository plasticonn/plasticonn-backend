"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const upload_middleware_1 = require("../../common/middleware/upload.middleware");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const partners_service_1 = require("./partners.service");
/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Partners endpoints
 */
/**
 * @swagger
 * /api/partner:
 *   get:
 *     summary: Gets partners
 *     tags: [Partners]
 *     responses:
 *       200:
 *         description: Partners retrieved successfully
 */
const log = new logger_1.Logger("PartnerController");
exports.PartnerController = (0, express_1.Router)();
exports.PartnerController.get("/", async (req, res) => {
    try {
        const data = await partners_service_1.PartnerService.getPartners();
        res.json((0, api_response_1.ApiResponse)(200, "Partners fetched", data));
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
 * /api/partner:
 *   post:
 *     summary: Add parnters
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added partner
 */
exports.PartnerController.post("/", upload_middleware_1.upload.single("logo"), async (req, res) => {
    try {
        if (!req.file) {
            throw new HttpError_1.HttpError(400, "Image file is required");
        }
        const partner = await partners_service_1.PartnerService.addPartner(req.file, req.body.name);
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(201, "Partner added", partner));
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
 * /api/partner/{id}:
 *   delete:
 *     summary: Remove partner
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the partner to remove
 *     responses:
 *       200:
 *         description: Successfully removed partner
 */
exports.PartnerController.delete("/:id", async (req, res) => {
    try {
        const result = await partners_service_1.PartnerService.removePartner(req.params.id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(201, "Partner removed", result.message));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
