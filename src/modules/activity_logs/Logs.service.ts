import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";
import { LogsModel } from "./Logs.model";

const log = new Logger("Logs service");

export const addLog = async (payload: any) => {
  try {
    log.info("Adding a new log");

    const add = await LogsModel.create(payload);

    if (add) return { success: true };
  } catch (error) {
    return { error: true, message: error };
  }
};

export const getLogs = async () => {
  log.info("Getting list of logs");

  const logs = await LogsModel.find()
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });

  if (!logs.length) {
    throw new HttpError(404, "There are no logs");
  }

  return { logs };
};

// export const readLogs = async () => {
//   log.info("Marking logs as read");
// };
