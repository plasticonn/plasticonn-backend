import { Router } from "express";
import { AdminService } from "../services/admin.service";
import { ApiResponse } from "../../../common/responses/api-response";
import { HttpStatus } from "../../../common/enum/http-status.enum";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { verifyToken } from "../../../common/middleware/auth.middleware";
import { checkRole } from "../../../common/middleware/role.middleware";

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

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // true in prod
      sameSite: "lax",
    });

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
 * /api/admin/profile:
 *   get:
 *     summary: Gets admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
AdminController.get(
  "/profile",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    try {
      const result = await AdminService.getProfile(user_id);

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
 * /api/admin/profile:
 *   put:
 *     summary: Update admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
AdminController.put(
  "/profile",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const payload = req.body;
    try {
      const result = await AdminService.updateProfile(user_id, payload);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Profile updated", result));
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
