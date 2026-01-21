import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { addLog } from "../../activity_logs/Logs.service";
import { CollectorsModel } from "../../collectors/collectors.model";

const log = new Logger("CollectorManagement");

const getCollector = async (collectorId: string) => {
  log.info("Fetching collector profile");

  const collector =
    await CollectorsModel.findById(collectorId).select("-password");

  if (!collector) throw new HttpError(404, "Collector not found");

  return { collector };
};

const updateCollector = async (collectorId: string, payload: any) => {
  log.info("Updating collector profile");

  const collector = await CollectorsModel.findById(collectorId);

  if (!collector) throw new HttpError(404, "Collector not found");

  Object.assign(collector, payload);

  await collector.save();

  return { collector };
};

const updateStatus = async (collectorId: string, status: string) => {
  log.info("Updating collector status");

  const collector = await CollectorsModel.findById(collectorId);

  if (!collector) throw new HttpError(404, "Collector not found");

  Object.assign(collector, status);

  await addLog({
    type: "Status update",
    admin: "Super admin",
    action: `Collector status has been updated to ${status}`,
    userId: collectorId,
    userType: "Collectors",
  });

  await collector.save();

  return { collector };
};

const deleteCollector = async (collectorId: string) => {
  log.info("Deleting collector");

  const collector = await CollectorsModel.findByIdAndDelete(collectorId);

  if (!collector) {
    throw new HttpError(404, "Collector not found");
  }

  await addLog({
    type: "Account deletion",
    admin: "Admin",
    action: `Collector account has been deleted by admin`,
    userId: collectorId,
    userType: "Collectors",
  });

  return { message: "Collector deleted successfully" };
};

const getCollectors = async () => {
  log.info("Getting all collectors");

  const collectors = await CollectorsModel.find().select("-password");

  if (collectors.length <= 0) throw new HttpError(404, "No collectors found");

  return { collectors };
};

export const CollectorServices = {
  getCollector,
  getCollectors,
  updateCollector,
  updateStatus,
  deleteCollector,
};
