import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { CenterService } from "./centers.service";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { upload } from "../../common/middleware/upload.middleware";

/**
 * @swagger
 * tags:
 *   name: Center
 *   description: Centers' endpoints
 */

const log = new Logger("CenterController");
export const CenterController = Router();

/**
 * @swagger
 * /api/center/register:
 *   post:
 *     summary: Register a center (i.e recycling or collection)
 *     tags: [Center]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               lng:
 *                 type: number
 *               lat:
 *                 type: number
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               centerType:
 *                 type: string
 *               formal:
 *                 type: boolean
 *               materialsAccepted:
 *                 type: array
 *                 items:
 *                   type: string
 *               capacity:
 *                 type: string
 *               operatingHours:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Successfully registered
 */
CenterController.post("/register", upload.single("image"), async (req, res) => {
  try {
    const result = await CenterService.register(req.body, req.file);

    res.clearCookie("token");

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res
      .status(HttpStatus.CREATED)
      .json(
        ApiResponse(
          HttpStatus.CREATED,
          "Center registered successfully",
          result,
        ),
      );
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
 * /api/center/login:
 *   post:
 *     summary: Logs in a center (i.e recylcing or collection)
 *     tags: [Center]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               centerId:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Login successful
 */
CenterController.post("/login", async (req, res) => {
  try {
    const result = await CenterService.login(
      req.body.centerId,
      req.body.password,
    );

    res.clearCookie("token");

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
    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});

/**
 * @swagger
 * /api/center/profile/{id}:
 *   get:
 *     summary: Gets center profile
 *     tags: [Center]
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
CenterController.get(
  "/profile/:id",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await CenterService.getProfile(id);

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
 * /api/center/profile:
 *   put:
 *     summary: Update center profile
 *     tags: [Center]
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
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               materialsAccepted:
 *                 type: array
 *                 items:
 *                   type: string
 *               capacity:
 *                 type: string
 *               operatingHours:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated profile
 */
CenterController.put(
  "/profile",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const payload = req.body;

    try {
      const result = await CenterService.updateProfile(user_id, payload);

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
 * /api/center/delete:
 *   delete:
 *     summary: Delete center account
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted center
 */
CenterController.delete(
  "/delete",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    try {
      const result = await CenterService.deleteAccount(user_id);

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
 * /api/center/list:
 *   get:
 *     summary: Gets centers list
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List centers successfully
 */
CenterController.get(
  "/list",
  verifyToken,
  checkRole(["collector", "admin", "super_admin"]),
  async (req, res) => {
    try {
      const result = await CenterService.getCenters();

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Centers List returned", result));
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
 * /api/center/closest:
 *   get:
 *     summary: Gets closest centers list
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the user
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the user
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Number of centers to return (default 5)
 *     responses:
 *       200:
 *         description: List closest centers successfully
 */
CenterController.get(
  "/closest",
  verifyToken,
  checkRole(["collector"]),
  async (req, res) => {
    const { lat, lng } = req.query;
    try {
      const result = await CenterService.getClosestCenters(
        Number(lat),
        Number(lng),
      );

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse(HttpStatus.OK, "Closest centers list returned", result),
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
 * /api/center/dashboard:
 *   get:
 *     summary: Gets center stats
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return center stats successfully
 */
CenterController.get(
  "/dashboard",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    try {
      const result = await CenterService.getCenterStats(user_id);
      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Center stats returned", result));
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
 * /api/center/update-password:
 *   post:
 *     summary: Update center password
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
 *               curPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
CenterController.post(
  "/update-password",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const payload = req.body;
    try {
      const result = await CenterService.updatePassword(user_id, payload);
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
 * /api/center/verify-password-update:
 *   put:
 *     summary: Verify password update
 *     tags: [Center]
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
CenterController.put(
  "/verify-password-update",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const payload = req.body;
    try {
      const result = await CenterService.verifyPasswordUpdate(user_id, payload);
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
 * /api/center/picture:
 *   patch:
 *     summary: Update center profile picture
 *     tags: [Center]
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
 *         description: Successfully updated center picture
 */
CenterController.patch(
  "/picture",
  verifyToken,
  checkRole(["center"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const user_id = (req as any).user.sub;

      if (!req.file) {
        throw new HttpError(400, "Image file is required");
      }

      const updated = await CenterService.updateProfilePicture(
        user_id,
        req.file,
      );

      return res
        .status(200)
        .json(ApiResponse(200, "Center picture updated successfully", updated));
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
 * /api/center/picture:
 *   delete:
 *     summary: Delete center picture
 *     tags: [Center]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted center picture
 */
CenterController.delete(
  "/picture",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    try {
      const user_id = (req as any).user.sub;

      const updated = await CenterService.removeProfilePicture(user_id);

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
