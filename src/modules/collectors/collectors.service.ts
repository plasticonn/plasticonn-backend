import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CollectorsModel } from "./collectors.model";
import { config } from "../../config";
import { Logger } from "../../common/logger/logger";
import { Roles } from "../../common/enum/roles.enum";
import { HttpError } from "../../common/utils/HttpError";
import { addLog } from "../activity_logs/Logs.service";
import { passwordServices } from "../../common/utils/password";

const log = new Logger("CollectorsService");

export const register = async (payload: any) => {
  log.info("Registering collector");

  const collector = await CollectorsModel.findOne({ email: payload.email });

  if (collector) throw new HttpError(409, "Collector already exists");

  const hashed = await bcrypt.hash(payload.password, 10);

  const user = await CollectorsModel.create({
    ...payload,
    password: hashed,
  });

  await addLog({
    type: "User registration",
    admin: null,
    action: `A new collector ${payload.email} just registered`,
  });

  const token = jwt.sign(
    { sub: payload.email, role: Roles.COLLECTOR },
    config.jwtSecret,
    {
      expiresIn: "7d",
    },
  );

  return { user, token };
};

export const login = async (email: string, password: string) => {
  log.info("logging in collector");

  const user = await CollectorsModel.findOne({ email });

  if (!user) throw new HttpError(404, "Collector does not exist");

  //const match = await bcrypt.compare(password, String(user.password));

  const match = await passwordServices.verifyPassword(
    password,
    String(user.password),
  );

  if (!match) throw new HttpError(422, "Invalid password");

  const token = jwt.sign(
    { sub: user._id, role: Roles.COLLECTOR },
    config.jwtSecret,
    {
      expiresIn: "7d",
    },
  );

  return { user, token };
};

const getProfile = async (collectorId: string) => {
  log.info("Fetching collector profile");

  const collector =
    await CollectorsModel.findById(collectorId).select("-password");

  if (!collector) throw new HttpError(404, "Collector not found");

  return { collector };
};

const updateProfile = async (collectorId: string, payload: any) => {
  log.info("Updating collector profile");

  const collector = await CollectorsModel.findById(collectorId);

  if (!collector) throw new HttpError(404, "Collector not found");

  Object.assign(collector, payload);

  await collector.save();

  return { collector };
};

const deleteAccount = async (collectorId: string) => {
  log.info("Deleting collector");

  const collector = await CollectorsModel.findByIdAndDelete(collectorId);

  if (!collector) {
    throw new HttpError(404, "Collector not found");
  }

  await addLog({
    type: "Account deletion",
    admin: null,
    action: "A collector has deleted their account",
    userId: collectorId,
  });

  return { message: "Account deleted successfully" };
};

export const CollectorsService = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
};
