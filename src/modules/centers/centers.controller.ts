import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { CenterService } from "./centers.service";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";

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
 *     summary: Register a center (i.e recylcing or collection)
 *     tags: [Center]
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
 *
 *     responses:
 *       200:
 *         description: Successfully registered
 */
CenterController.post("/register", async (req, res) => {
  try {
    const result = await CenterService.register(req.body);
    return res
      .status(HttpStatus.CREATED)
      .json(
        ApiResponse(
          HttpStatus.CREATED,
          "Center registered successfully",
          result
        )
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
      req.body.password
    );
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
  checkRole(["center", "collector"]),
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
  }
);

/**
 * @swagger
 * /api/center/profile/{id}:
 *   put:
 *     summary: Update center profile
 *     tags: [Center]
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
  "/profile/:id",
  verifyToken,
  checkRole(["center"]),
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
      const result = await CenterService.updateProfile(id, payload);
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
