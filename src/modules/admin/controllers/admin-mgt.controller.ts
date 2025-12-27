import { Router } from "express";
import { ApiResponse } from "../../../common/responses/api-response";
import { HttpStatus } from "../../../common/enum/http-status.enum";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { verifyToken } from "../../../common/middleware/auth.middleware";
import { checkRole } from "../../../common/middleware/role.middleware";
import { adminServices } from "../services/admin-mgt.service";

/**
 * @swagger
 * tags:
 *   name: Admin Management
 *   description: Admin management endpoints for admins
 */

const log = new Logger("AdminManagementController");
export const AdminManagementController = Router();

/**
 * @swagger
 * /api/admin/add:
 *   post:
 *     summary: Add an admin
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Successfully registered
 */
AdminManagementController.post(
  "/add",
  checkRole(["super_admin"]),
  async (req, res) => {
    try {
      const result = await adminServices.addAdmin(req.body);
      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse(HttpStatus.CREATED, "Admin added", result));
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
 * /api/admin/admin-mgt/profile/{id}:
 *   get:
 *     summary: Gets admin profile
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to return
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
AdminManagementController.get(
  "/profile/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await adminServices.getAdmin(id);

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
 * /api/admin/admin-mgt/list:
 *   get:
 *     summary: Gets list of admin
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admins list retrieved successfully
 */
AdminManagementController.get(
  "/list",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const result = await adminServices.getAdmins();

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "List returned", result));
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
 * /api/admin/admin-mgt/update/{id}:
 *   put:
 *     summary: Update admin details
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully updated admin details
 */
AdminManagementController.put(
  "/update/:id",
  verifyToken,
  checkRole(["super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    const payload = req.body;

    try {
      const result = await adminServices.updateAdmin(id, payload);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Admin details updated", result));
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
 * /api/admin/admin-mgt/status/{id}:
 *   put:
 *     summary: Update admin status
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to update
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
 *         description: Successfully updated admin status profile
 */
AdminManagementController.put(
  "/status/:id",
  verifyToken,
  checkRole(["super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    const status = req.body;

    try {
      const result = await adminServices.updateStatus(id, status);

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
 * /api/admin/admin-mgt/delete/{id}:
 *   delete:
 *     summary: Delete admin account
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to delete
 *     responses:
 *       200:
 *         description: Successfully deleted admin
 */
AdminManagementController.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["super_admin"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await adminServices.removeAdmin(id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Admin deleted", result));
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
