"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const express_1 = require("express");
const events_service_1 = require("./events.service");
const api_response_1 = require("../../common/responses/api-response");
const http_status_enum_1 = require("../../common/enum/http-status.enum");
const logger_1 = require("../../common/logger/logger");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const role_middleware_1 = require("../../common/middleware/role.middleware");
const HttpError_1 = require("../../common/utils/HttpError");
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Events endpoints
 */
const log = new logger_1.Logger("EventsController");
exports.EventsController = (0, express_1.Router)();
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
exports.EventsController.post("/create", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin"]), async (req, res) => {
    try {
        const result = await events_service_1.EventsService.createEvent(req.body);
        return res
            .status(http_status_enum_1.HttpStatus.CREATED)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.CREATED, "Event created successfully", result));
    }
    catch (err) {
        log.error(err.message);
        return res
            .status(http_status_enum_1.HttpStatus.BAD_REQUEST)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.BAD_REQUEST, err.message));
    }
});
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
exports.EventsController.get("/get", async (_req, res) => {
    try {
        const result = await events_service_1.EventsService.getEventList();
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Events fetched successfully", result));
    }
    catch (err) {
        log.error(err.message);
        const status = err.statusCode || http_status_enum_1.HttpStatus.BAD_REQUEST;
        return res.status(status).json((0, api_response_1.ApiResponse)(status, err.message));
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
exports.EventsController.get("/detail/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await events_service_1.EventsService.getEventById(id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Event detail returned", result));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res.status(err.status).json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
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
exports.EventsController.put("/update/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin"]), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await events_service_1.EventsService.updateEvent(id, req.body);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, "Event updated successfully", result));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res
                .status(err.status)
                .json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
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
exports.EventsController.delete("/delete/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)(["admin"]), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await events_service_1.EventsService.deleteEvent(id);
        return res
            .status(http_status_enum_1.HttpStatus.OK)
            .json((0, api_response_1.ApiResponse)(http_status_enum_1.HttpStatus.OK, result.message));
    }
    catch (err) {
        log.error(err.message);
        if (err instanceof HttpError_1.HttpError) {
            return res
                .status(err.status)
                .json((0, api_response_1.ApiResponse)(err.status, err.message));
        }
        return res.status(500).json((0, api_response_1.ApiResponse)(500, "Internal server error"));
    }
});
