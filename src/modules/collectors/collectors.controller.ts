import { Router } from "express";
import { CollectorsService } from "./collectors.service";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { Logger } from "../../common/logger/logger";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpError } from "../../common/utils/HttpError";

/**
 * @swagger
 * tags:
 *   name: Collector
 *   description: Collectors' endpoints
 */

const log = new Logger("CollectorController");
export const CollectorController = Router();

/**
 * @swagger
 * /api/collector/register:
 *   post:
 *     summary: Registers a collector
 *     tags: [Collector]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully registered
 */
CollectorController.post("/register", async (req, res) => {
  try {
    const result = await CollectorsService.register(req.body);
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse(HttpStatus.CREATED, "User registered", result));
  } catch (err: any) {
    log.error(err.message);
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(ApiResponse(HttpStatus.BAD_REQUEST, err.message));
  }
});

/**
 * @swagger
 * /api/collector/login:
 *   post:
 *     summary: Logs in a collector
 *     tags: [Collector]
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
CollectorController.post("/login", async (req, res) => {
  try {
    const result = await CollectorsService.login(
      req.body.email,
      req.body.password,
    );

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
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(ApiResponse(HttpStatus.BAD_REQUEST, err.message));
  }
});

/**
 * @swagger
 * /api/collector/profile/{id}:
 *   get:
 *     summary: Gets collector profile
 *     tags: [Collector]
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
CollectorController.get(
  "/profile/:id",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await CollectorsService.getProfile(id);
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
 * /api/collector/profile:
 *   put:
 *     summary: Update collector profile
 *     tags: [Collector]
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated profile
 */
CollectorController.put(
  "/profile",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const payload = req.body;

    try {
      const result = await CollectorsService.updateProfile(user_id, payload);
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
  },
);

/**
 * @swagger
 * /api/collector/delete:
 *   delete:
 *     summary: Delete collector account
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted account
 */
CollectorController.delete(
  "/delete",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    try {
      const result = await CollectorsService.deleteAccount(user_id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Account deleted", result));
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
