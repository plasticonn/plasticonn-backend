"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardController = void 0;
const express_1 = require("express");
const logger_1 = require("../../common/logger/logger");
const api_response_1 = require("../../common/responses/api-response");
const HttpError_1 = require("../../common/utils/HttpError");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const leaderboard_service_1 = require("./leaderboard.service");
/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Leaderboard endpoints
 */
const log = new logger_1.Logger("LeaderboardController");
exports.LeaderboardController = (0, express_1.Router)();
/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get top collectors leaderboard
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 */
exports.LeaderboardController.get("/", async (req, res) => {
    try {
        const data = await leaderboard_service_1.LeaderboardService.getTopCollectors();
        res.json((0, api_response_1.ApiResponse)(200, "Leaderboard fetched", data));
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
 * /api/leaderboard/my-rank:
 *   get:
 *     summary: Get collector rank
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Collector rank retrieved successfully
 */
exports.LeaderboardController.get("/my-rank", auth_middleware_1.verifyToken, async (req, res) => {
    try {
        const collector_id = req.user.sub;
        const data = await leaderboard_service_1.LeaderboardService.getCollectorRank(collector_id);
        return res.json((0, api_response_1.ApiResponse)(200, "Collector rank fetched", data));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
