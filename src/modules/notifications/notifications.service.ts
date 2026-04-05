import { NotificationsModel } from "./notifications.model";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";

const log = new Logger("NotificationService");

const sendNotification = async (
  user_id: string | null,
  payload: any,
  type: string | null,
) => {
  log.info("Sending a notification");

  const notification = await NotificationsModel.create({
    user_id,
    ...payload,
    type,
  });

  return { notification };
};

const getNotifications = async (user_id: string) => {
  log.info("get list of notifications for user");

  const notifications = await NotificationsModel.find({
    $or: [{ user_id }, { type: "general" }],
  });

  if (notifications.length === 0) {
    throw new HttpError(404, "No notifications found");
  }

  return { notifications };
};

const readNotification = async (notification_id: string) => {
  log.info("update notification to read");

  const notification = await NotificationsModel.findOneAndUpdate(
    {
      _id: notification_id,
    },
    { read: true },
    { new: true },
  );

  return { notification };
};

const readAllNotifications = async (user_id: string) => {
  log.info("Mark all as read");

  const result = await NotificationsModel.updateMany(
    { user_id },
    { $set: { read: true } },
  );

  return { result };
};

export const NotificationsService = {
  sendNotification,
  getNotifications,
  readNotification,
  readAllNotifications,
};
