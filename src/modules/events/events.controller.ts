import { Router } from "express";
import { EventsService } from "./events.service";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { Logger } from "../../common/logger/logger";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpError } from "../../common/utils/HttpError";

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Events endpoints
 */

const log = new Logger("EventsController");
export const EventsController = Router();

/**
 * @swagger
 * /api/events/create:
 *   post:
 *     summary: Create an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 */
EventsController.post(
  "/create",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const result = await EventsService.createEvent(req.body);

      return res
        .status(HttpStatus.CREATED)
        .json(
          ApiResponse(HttpStatus.CREATED, "Event created successfully", result)
        );
    } catch (err: any) {
      log.error(err.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse(HttpStatus.BAD_REQUEST, err.message));
    }
  }
);

/**
 * @swagger
 * /api/events/get:
 *   get:
 *     summary: Get list of events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Events fetched successfully
 */
EventsController.get("/get", async (_req, res) => {
  try {
    const result = await EventsService.getEventList();

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(HttpStatus.OK, "Events fetched successfully", result));
  } catch (err: any) {
    log.error(err.message);

    const status = err.statusCode || HttpStatus.BAD_REQUEST;
    return res.status(status).json(ApiResponse(status, err.message));
  }
});

/**
 * @swagger
 * /api/events/detail/{id}:
 *   get:
 *     summary: Get event details
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 */
EventsController.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await EventsService.getEventById(id);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(HttpStatus.OK, "Event detail returned", result));
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
 * /api/events/update/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
EventsController.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await EventsService.updateEvent(id, req.body);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Event updated successfully", result));
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
 * /api/events/delete/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 */
EventsController.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await EventsService.deleteEvent(id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, result.message));
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
