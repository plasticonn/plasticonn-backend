import { Router } from "express";
import { CollectorsService } from "./collectors.service";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { Logger } from "../../common/logger/logger";

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
      req.body.password
    );
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
