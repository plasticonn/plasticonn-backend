import { DropsModel } from "./drops.model";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";
import { NotificationsService } from "../notifications/notifications.service";
import { generateDropId } from "../../common/utils/generateCode";

const log = new Logger("DropsService");

const addDrop = async (user_id: string, payload: any) => {
  log.info("Adding a drop offs");

  const dropId = generateDropId();

  const drop = await DropsModel.create({
    drop_id: dropId,
    collector_id: user_id,
    ...payload,
    location: {
      type: "Point",
      coordinates: [payload.location.lng, payload.location.lat],
    },
  });

  const message = {
    title: "New drop off",
    message: "You have a new drop-off request.",
  };

  await NotificationsService.sendNotification(
    payload.center_id,
    message,
    "individual",
  );

  return { drop };
};

const getDropList = async (user_id: string) => {
  log.info("get list of drop offs");

  const drops = await DropsModel.find({
    $or: [{ collector_id: user_id }, { center_id: user_id }],
  })
    .populate("collector_id", "firstName image")
    .populate("center_id", "name image");

  if (drops.length === 0) {
    throw new HttpError(404, "No drops found");
  }

  return { drops };
};

const getDropById = async (drop_id: string, user_id: string) => {
  const drop = await DropsModel.findOne({
    _id: drop_id,
    $or: [{ collector_id: user_id }, { center_id: user_id }],
  });

  if (!drop) throw new HttpError(404, "Drop not found");

  return { drop };
};

const updateDrop = async (
  drop_id: string,
  center_id: string,
  status: string,
) => {
  const drop = await DropsModel.findOneAndUpdate(
    {
      _id: drop_id,
      center_id,
    },
    { status: status },
    { new: true },
  );

  if (!drop) {
    throw new HttpError(
      403,
      "You are not authorized to verify this drop or it does not exist",
    );
  }

  const payload = {
    title: "Status Update Notification",
    message: `Your drop-off has been ${status}.`,
  };

  await NotificationsService.sendNotification(
    String(drop?.collector_id),
    payload,
    "individual",
  );

  return { drop };
};

export const DropsService = {
  addDrop,
  getDropList,
  getDropById,
  updateDrop,
};
