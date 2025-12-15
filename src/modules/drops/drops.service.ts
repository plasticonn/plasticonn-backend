import { DropsModel } from "./drops.model";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";

const log = new Logger("DropsService");

const addDrop = async (user_id: string, payload: any) => {
  log.info("Adding a drop offs");

  const drop = await DropsModel.create({
    collector_id: user_id,
    ...payload,
  });

  return { drop };
};

const getDropList = async (user_id: string) => {
  log.info("get list of drop offs");

  const drops = await DropsModel.find({
    $or: [{ collector_id: user_id }, { center_id: user_id }],
  });

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

const verifyDrop = async (drop_id: string) => {
  const drop = await DropsModel.findByIdAndUpdate(
    drop_id,
    { verified: true },
    { new: true }
  );

  if (!drop) throw new HttpError(404, "Drop not found");

  return { drop };
};

export const DropsService = {
  addDrop,
  getDropList,
  getDropById,
  verifyDrop,
};
