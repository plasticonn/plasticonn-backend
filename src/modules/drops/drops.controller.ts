import { Router } from "express";
import { DropsService } from "./drops.service";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { Logger } from "../../common/logger/logger";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpError } from "../../common/utils/HttpError";
import { NotificationsService } from "../notifications/notifications.service";
import { upload } from "../../common/middleware/upload.middleware";

/**
 * @swagger
 * tags:
 *   name: Drops
 *   description: Drops' endpoints
 */

const log = new Logger("DropControllers");
export const DropController = Router();

/**
 * @swagger
 * /api/drop/add:
 *   post:
 *     summary: Adds a drop off
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               types:
 *                 types: string
 *               center_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               condition:
 *                 type: string
 *               lng:
 *                 type: number
 *               lat:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Drop off successful
 */
DropController.post(
  "/add",
  verifyToken,
  checkRole(["collector"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const user_id = (req as any).user.sub;

      const result = await DropsService.addDrop(user_id, req.body, req.file);

      const payload = {
        title: "Confirmation Notification",
        message: "Your drop-off request has been submitted successfully.",
      };

      await NotificationsService.sendNotification(
        user_id,
        payload,
        "individual",
      );

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse(HttpStatus.CREATED, "Drop off successful", result));
    } catch (err: any) {
      log.error(err.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse(HttpStatus.BAD_REQUEST, err.message));
    }
  },
);

/**
 * @swagger
 * /api/drop/get:
 *   get:
 *     summary: Gets list of drop offs for user
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved drop list
 */
DropController.get(
  "/get",
  verifyToken,
  checkRole(["collector", "center"]),
  async (req, res) => {
    try {
      const userId = (req as any).user.sub;

      const result = await DropsService.getDropList(userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Drops fetched successfully", result));
    } catch (err: any) {
      log.error(err.message);

      const status = err.statusCode || HttpStatus.BAD_REQUEST;

      return res.status(status).json(ApiResponse(status, err.message));
    }
  },
);

/**
 * @swagger
 * /api/drop/detail/{id}:
 *   get:
 *     summary: Gets drop details
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the drop to return
 *     responses:
 *       200:
 *         description: Drop detail retrieved successfully
 */
DropController.get(
  "/detail/:id",
  verifyToken,
  checkRole(["collector", "center"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const user_id = (req as any).user.sub;

      const result = await DropsService.getDropById(id, user_id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Drop detail returned", result));
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
 * /api/drop/update/{id}:
 *   put:
 *     summary: Updates drop off status
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the drop to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated drop off
 */
DropController.put(
  "/update/:id",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const user_id = (req as any).user.sub;

    try {
      const result = await DropsService.updateDrop(id, user_id, status);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Drop off updated", result));
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
