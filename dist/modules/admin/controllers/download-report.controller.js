"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDownloadController = void 0;
const express_1 = require("express");
const download_report_service_1 = require("../services/download-report.service");
const auth_middleware_1 = require("../../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../../common/middleware/role.middleware");
const logger_1 = require("../../../common/logger/logger");
const HttpError_1 = require("../../../common/utils/HttpError");
const api_response_1 = require("../../../common/responses/api-response");
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admins' endpoints
 */
const log = new logger_1.Logger("AdminDownloadController");
exports.AdminDownloadController = (0, express_1.Router)();
/**
 * @swagger
 * /api/admin/download-report:
 *   get:
 *     summary: Download datasets in various formats
 *     description: |
 *       Allows an admin to download platform data (centers, collectors, admins, etc.)
 *       in different formats such as CSV, Excel, PDF, or GeoJSON.
 *
 *       Additional query parameters can be used as filters.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataset
 *         required: true
 *         schema:
 *           type: string
 *           example: centers
 *         description: Dataset to download (e.g. centers, collectors, drop offs)
 *
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, excel, pdf, geojson]
 *           example: csv
 *         description: File format for the download
 *
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           example: 2024-01-01
 *         description: Filter records created from this date
 *
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           example: 2024-12-31
 *         description: Filter records created up to this date
 *
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           example: formal
 *         description: Optional dataset-specific filter (e.g. center type)
 *
 *     responses:
 *       200:
 *         description: File generated successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       400:
 *         description: Invalid dataset or format
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden (admin access only)
 *
 *       500:
 *         description: Internal server error
 */
exports.AdminDownloadController.get("/download-report", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin", "super_admin"]), async (req, res) => {
    try {
        const { dataset, format, ...filters } = req.query;
        const file = await download_report_service_1.AdminDownloadService.generate(dataset, format, filters);
        res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
        res.setHeader("Content-Type", file.contentType);
        return res.send(file.buffer);
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
