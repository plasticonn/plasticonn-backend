import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { CenterService } from "./centers.service";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";

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
