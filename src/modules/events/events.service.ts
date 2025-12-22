import { EventsModel } from "./events.model";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";
import { NotificationsService } from "../notifications/notifications.service";

const log = new Logger("EventsService");

/**
 * Create Event
 */
const createEvent = async (payload: any) => {
  log.info("Creating an event");

  const event = await EventsModel.create({
    ...payload,
  });

  const message = {
    title: "New event",
    message: "There is an upcoming event. Click below to learn more.",
  };

  const user_id = null;

  await NotificationsService.sendNotification(user_id, message, "general");

  return { event };
};

/**
 * Get All Events
 */
const getEventList = async () => {
  log.info("Getting list of events");

  const events = await EventsModel.find().sort({ date: 1 });

  if (events.length === 0) {
    throw new HttpError(404, "No events found");
  }

  return { events };
};

/**
 * Get Event By ID
 */
const getEventById = async (event_id: string) => {
  log.info("Getting event by id");

  const event = await EventsModel.findOne({ _id: event_id });

  if (!event) throw new HttpError(404, "Event not found");

  return { event };
};

/**
 * Update Event
 */
const updateEvent = async (event_id: string, payload: any) => {
  log.info("Updating event");

  const event = await EventsModel.findOneAndUpdate(
    { _id: event_id },
    { ...payload },
    { new: true }
  );

  if (!event) throw new HttpError(404, "Event not found");

  return { event };
};

/**
 * Delete Event
 */
const deleteEvent = async (event_id: string) => {
  log.info("Deleting event");

  const event = await EventsModel.findOneAndDelete({ _id: event_id });

  if (!event) throw new HttpError(404, "Event not found");

  return { message: "Event deleted successfully" };
};

export const EventsService = {
  createEvent,
  getEventList,
  getEventById,
  updateEvent,
  deleteEvent,
};
