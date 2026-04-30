import { Router } from "express";
import { CollectorsService } from "./collectors.service";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { Logger } from "../../common/logger/logger";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpError } from "../../common/utils/HttpError";
import { upload } from "../../common/middleware/upload.middleware";

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
 *         multipart/form-data:
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
CollectorController.post(
  "/register",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new HttpError(400, "Image file is required");
      }

      const result = await CollectorsService.register(req.body, req.file);
      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse(HttpStatus.CREATED, "User registered", result));
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
      secure: true, // true in prod
      sameSite: "none",
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

/**
 * @swagger
 * /api/collector/dashboard:
 *   get:
 *     summary: Gets collector stats
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return collector stats successfully
 */
CollectorController.get(
  "/dashboard",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    try {
      const result = await CollectorsService.getDashboardStats(user_id);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Collector stats returned", result));
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
 * /api/collector/update-password:
 *   post:
 *     summary: Update collector password
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
 *               curPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
CollectorController.post(
  "/update-password",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const payload = req.body;
    try {
      const result = await CollectorsService.updatePassword(user_id, payload);
      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse(
            HttpStatus.OK,
            "Password update initiated. Check mail for OTP.",
            result,
          ),
        );
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
 * /api/collector/verify-password-update:
 *   put:
 *     summary: Verify password update
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
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
CollectorController.put(
  "/verify-password-update",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const payload = req.body;
    try {
      const result = await CollectorsService.verifyPasswordUpdate(
        user_id,
        payload,
      );
      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse(HttpStatus.OK, "Password updated successfully.", result),
        );
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
 * /api/collector/picture:
 *   patch:
 *     summary: Update collector profile picture
 *     tags: [collector]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Successfully updated collector picture
 */
CollectorController.patch(
  "/picture",
  verifyToken,
  checkRole(["collector"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const user_id = (req as any).user.sub;

      if (!req.file) {
        throw new HttpError(400, "Image file is required");
      }

      const updated = await CollectorsService.updateProfilePicture(
        user_id,
        req.file,
      );

      return res
        .status(200)
        .json(
          ApiResponse(200, "collector picture updated successfully", updated),
        );
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
 * /api/collector/picture:
 *   delete:
 *     summary: Delete collector picture
 *     tags: [collector]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted collector picture
 */
CollectorController.delete(
  "/picture",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    try {
      const user_id = (req as any).user.sub;

      const updated = await CollectorsService.removeProfilePicture(user_id);

      return res
        .status(200)
        .json(
          ApiResponse(200, "Profile picture removed successfully", updated),
        );
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
