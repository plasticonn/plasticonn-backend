"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteController = void 0;
const express_1 = require("express");
const website_service_1 = require("./website.service");
const logger_1 = require("../../common/logger/logger");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
/**
 * @swagger
 * tags:
 *   name: Website
 *   description: Website endpoints
 */
const log = new logger_1.Logger("WebsiteController");
exports.WebsiteController = (0, express_1.Router)();
/**
 * @swagger
 * /api/website:
 *   get:
 *     summary: Gets website data
 *     tags: [Website]
 *     responses:
 *       200:
 *         description: Website data retrieved successfully
 */
exports.WebsiteController.get("/", async (req, res) => {
    try {
        const result = await website_service_1.Website.websiteData();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Website data returned", result));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
