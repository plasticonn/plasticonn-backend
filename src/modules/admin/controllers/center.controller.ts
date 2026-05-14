import { Router } from "express";
import multer from "multer";
import { CenterManagement } from "../services/center.service";
import { ApiResponse } from "../../../common/responses/api-response";
import { HttpStatus } from "../../../common/enum/http-status.enum";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { verifyToken } from "../../../common/middleware/auth.middleware";
import { checkRole } from "../../../common/middleware/role.middleware";
import { CenterService } from "../../centers/centers.service";

/**
 * @swagger
 * tags:
 *   name: Center Management
 *   description: Center management endpoints for admins
 */

const log = new Logger("CenterManagementController");
export const CenterManagementController = Router();

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/admin/center-mgt/add:
 *   post:
 *     summary: Bulk add centers via file upload
 *     tags: [Center Management]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Centers added successfully
 */
CenterManagementController.post(
  "/add",
  // verifyToken,
  // checkRole(["admin", "super_admin"]),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new HttpError(400, "File is required");
      }

      const result = await CenterManagement.bulkAddCenters(req.file);

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse(HttpStatus.CREATED, "Centers added", result));
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
 * /api/admin/center-mgt/profile/{id}:
 *   get:
 *     summary: Gets center profile
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to return
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
CenterManagementController.get(
  "/profile/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await CenterManagement.getCenter(id);
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
  },
);

/**
 * @swagger
 * /api/admin/center-mgt/update/{id}:
 *   put:
 *     summary: Update center details
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully updated center details
 */
CenterManagementController.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
      const result = await CenterManagement.updateCenter(id, payload);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Center details updated", result));
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
 * /api/admin/center-mgt/status/{id}:
 *   put:
 *     summary: Update center status
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to update
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
 *         description: Successfully updated center status
 */
CenterManagementController.put(
  "/status/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    const { status } = req.body;

    try {
      const result = await CenterManagement.updateStatus(id, status);
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
  },
);

/**
 * @swagger
 * /api/admin/center-mgt/verify/{id}:
 *   put:
 *     summary: Verify center
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to verify
 *     responses:
 *       200:
 *         description: Successfully verified center
 */
CenterManagementController.put(
  "/verify/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;
    const formal = req.body;
    try {
      const result = await CenterManagement.verifyCenter(id, formal);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Center verified", result));
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
 * /api/admin/center-mgt/delete/{id}:
 *   delete:
 *     summary: Delete center account
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the center to delete
 *     responses:
 *       200:
 *         description: Successfully deleted center
 */
CenterManagementController.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await CenterManagement.deleteCenter(id);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Center deleted", result));
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
 * /api/admin/center-mgt/list:
 *   get:
 *     summary: Gets list of centers
 *     tags: [Center Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Centers list retrieved successfully
 */
CenterManagementController.get(
  "/list",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const result = await CenterService.getCenters();

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
  },
);
