import { Router } from "express";
import { ApiResponse } from "../../../common/responses/api-response";
import { HttpStatus } from "../../../common/enum/http-status.enum";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { verifyToken } from "../../../common/middleware/auth.middleware";
import { checkRole } from "../../../common/middleware/role.middleware";
import { CollectorServices } from "../services/collector.service";

/**
 * @swagger
 * tags:
 *   name: Collector Management
 *   description: Collector management endpoints for admins
 */

const log = new Logger("CollectorManagementController");
export const CollectorManagementController = Router();

/**
 * @swagger
 * /api/admin/collector-mgt/profile/{id}:
 *   get:
 *     summary: Gets collector profile
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to return
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
CollectorManagementController.get(
  "/profile/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await CollectorServices.getCollector(id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Profile returned", result));
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
 * /api/admin/collector-mgt/update/{id}:
 *   put:
 *     summary: Update collector details
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully updated collector details
 */
CollectorManagementController.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    const payload = req.body;

    try {
      const result = await CollectorServices.updateCollector(id, payload);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Collector details updated", result));
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
 * /api/admin/collector-mgt/status/{id}:
 *   put:
 *     summary: Update collector status
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to update
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
 *         description: Successfully updated collector status profile
 */
CollectorManagementController.put(
  "/status/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    const status = req.body;

    try {
      const result = await CollectorServices.updateCollector(id, status);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Status updated", result));
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
 * /api/admin/collector-mgt/delete/{id}:
 *   delete:
 *     summary: Delete collector account
 *     tags: [Collector Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collector to delete
 *     responses:
 *       200:
 *         description: Successfully deleted collector
 */
CollectorManagementController.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await CollectorServices.deleteCollector(id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Collector deleted", result));
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
