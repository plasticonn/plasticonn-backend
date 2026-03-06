import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { NotificationsService } from "./notifications.service";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications' endpoints
 */

const log = new Logger("NotificationController");
export const NotificationController = Router();

/**
 * @swagger
 * /api/notification/list:
 *   get:
 *     summary: Gets user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications returned successfully
 */
NotificationController.get(
  "/list",
  verifyToken,
  checkRole(["collector", "center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    try {
      const result = await NotificationsService.getNotifications(user_id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Notifications returned", result));
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

/**
 * @swagger
 * /api/notification/read/{id}:
 *   put:
 *     summary: Update notification status
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to update
 *     responses:
 *       200:
 *         description: Successfully updated notification
 */
NotificationController.put(
  "/read/:id",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await NotificationsService.readNotification(id);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Notification updated", result));
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

/**
 * @swagger
 * /api/notification/read:
 *   put:
 *     summary: Read all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated notifications
 */
NotificationController.put(
  "/read",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    try {
      const result = await NotificationsService.readAllNotifications(user_id);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Notifications updated", result));
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
