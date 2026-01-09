import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";
import {
  getAnalyticsStats,
  getDashboardStats,
  yearlyPlasticCollection,
} from "./dashboard.service";

const log = new Logger("DashboardController");
export const DashboardController = Router();

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned stats
 */
DashboardController.get(
  "/stats",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const result = await getDashboardStats();
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Data retrieved", result));
    } catch (err: any) {
      log.error(err.message);
      if (err instanceof HttpError) {
        return res
          .status(err.status)
          .json(ApiResponse(err.status, err.message));
      }

      return res.status(500).json(ApiResponse(500, "Internal server error"));
    }
  }
);

/**
 * @swagger
 * /api/admin/dashboard/graph:
 *   get:
 *     summary: Get plastic collection graph stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned graph stats
 */
DashboardController.get(
  "/graph",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const result = await yearlyPlasticCollection();
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Data retrieved", result));
    } catch (err: any) {
      log.error(err.message);
      if (err instanceof HttpError) {
        return res
          .status(err.status)
          .json(ApiResponse(err.status, err.message));
      }

      return res.status(500).json(ApiResponse(500, "Internal server error"));
    }
  }
);

/**
 * @swagger
 * /api/admin/dashboard/analytics:
 *   get:
 *     summary: Get plastic collection analytics stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned stats
 */
DashboardController.get(
  "/analytics",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const result = await getAnalyticsStats();
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Data retrieved", result));
    } catch (err: any) {
      log.error(err.message);
      if (err instanceof HttpError) {
        return res
          .status(err.status)
          .json(ApiResponse(err.status, err.message));
      }

      return res.status(500).json(ApiResponse(500, "Internal server error"));
    }
  }
);
