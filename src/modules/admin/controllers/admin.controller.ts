import { Router } from "express";
import { AdminService } from "../services/admin.service";
import { ApiResponse } from "../../../common/responses/api-response";
import { HttpStatus } from "../../../common/enum/http-status.enum";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { verifyToken } from "../../../common/middleware/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admins' endpoints
 */

const log = new Logger("AdminController");
export const AdminController = Router();

/**
 * @swagger
 * /api/admin/add:
 *   post:
 *     summary: Add an admin
 *     tags: [Admin]
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
AdminController.post("/add", async (req, res) => {
  try {
    const result = await AdminService.add(req.body);
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse(HttpStatus.CREATED, "Admin added", result));
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
 * /api/admin/login:
 *   post:
 *     summary: Logs in an admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
AdminController.post("/login", async (req, res) => {
  try {
    const result = await AdminService.login(req.body.email, req.body.password);
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse(HttpStatus.CREATED, "Login successful", result));
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
 * /api/admin/profile/{id}:
 *   get:
 *     summary: Gets admin profile
 *     tags: [Admin]
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
AdminController.get("/profile/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminService.getProfile(id);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(HttpStatus.OK, "Profile returned", result));
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
 * /api/admin/profile/{id}:
 *   put:
 *     summary: Update admin profile
 *     tags: [Admin]
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
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated profile
 */
AdminController.put("/profile/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const result = await AdminService.updateProfile(id, payload);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(HttpStatus.OK, "Profile updated", result));
  } catch (err: any) {
    log.error(err.message);
    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});
