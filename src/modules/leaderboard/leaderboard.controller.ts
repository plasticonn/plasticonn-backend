import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { LeaderboardService } from "./leaderboard.service";

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Leaderboard endpoints
 */

const log = new Logger("LeaderboardController");
export const LeaderboardController = Router();

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
LeaderboardController.get("/", async (req, res) => {
  try {
    const data = await LeaderboardService.getTopCollectors();
    res.json(ApiResponse(200, "Leaderboard fetched", data));
  } catch (err: any) {
    log.error(err.message);

    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
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
LeaderboardController.get("/my-rank", verifyToken, async (req: any, res) => {
  try {
    const collector_id = (req as any).user.sub;

    const data = await LeaderboardService.getCollectorRank(collector_id);

    return res.json(ApiResponse(200, "Collector rank fetched", data));
  } catch (err: any) {
    log.error(err.message);

    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});
