"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const events_model_1 = require("./events.model");
const logger_1 = require("../../common/logger/logger");
const HttpError_1 = require("../../common/utils/HttpError");
const notifications_service_1 = require("../notifications/notifications.service");
const log = new logger_1.Logger("EventsService");
/**
 * Create Event
 */
const createEvent = async (payload) => {
    log.info("Creating an event");
    const event = await events_model_1.EventsModel.create({
        ...payload,
    });
    const message = {
        title: "New event",
        message: "There is an upcoming event. Click below to learn more.",
    };
    const user_id = null;
    await notifications_service_1.NotificationsService.sendNotification(user_id, message, "general");
    return { event };
};
/**
 * Get All Events
 */
const getEventList = async () => {
    log.info("Getting list of events");
    const events = await events_model_1.EventsModel.find().sort({ date: 1 });
    if (events.length === 0) {
        throw new HttpError_1.HttpError(404, "No events found");
    }
    return { events };
};
/**
 * Get Event By ID
 */
const getEventById = async (event_id) => {
    log.info("Getting event by id");
    const event = await events_model_1.EventsModel.findOne({ _id: event_id });
    if (!event)
        throw new HttpError_1.HttpError(404, "Event not found");
    return { event };
};
/**
 * Update Event
 */
const updateEvent = async (event_id, payload) => {
    log.info("Updating event");
    const event = await events_model_1.EventsModel.findOneAndUpdate({ _id: event_id }, { ...payload }, { new: true });
    if (!event)
        throw new HttpError_1.HttpError(404, "Event not found");
    return { event };
};
/**
 * Delete Event
 */
const deleteEvent = async (event_id) => {
    log.info("Deleting event");
    const event = await events_model_1.EventsModel.findOneAndDelete({ _id: event_id });
    if (!event)
        throw new HttpError_1.HttpError(404, "Event not found");
    return { message: "Event deleted successfully" };
};
exports.EventsService = {
    createEvent,
    getEventList,
    getEventById,
    updateEvent,
    deleteEvent,
};
