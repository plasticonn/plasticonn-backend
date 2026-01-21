import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";
import { getLogs } from "./Logs.service";

/**
 * @swagger
 * tags:
 *   name: Activity & Logs
 *   description: Activity and Logs endpoints
 */

const log = new Logger("AdminManagementController");
export const LogsController = Router();

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Gets logs
 *     tags: [Activity & Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 */
LogsController.get(
  "/logs",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const result = await getLogs();

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Logs returned", result));
    } catch (err: any) {
      log.error(err.message);

      if (err instanceof HttpError) {
        return res
          .status(err.status)
          .json(ApiResponse(err.status, err.message));
      }

      return res.status(500).json(ApiResponse(500, "Internal server error"));
    }
  },
);
