import { Roles } from "../../common/enum/roles.enum";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";
import { passwordServices } from "../../common/utils/password";
import { CenterModel } from "./centers.model";
import { config } from "../../config";
import jwt from "jsonwebtoken";
import { generateCenterId } from "../../common/utils/generateCode";

const log = new Logger("AdminService");

const register = async (payload: any) => {
  log.info("Registering center");

  const centerExists = await CenterModel.findOne({ name: payload.name });

  if (centerExists) throw new HttpError(409, "Center already exists");

  const centerId = generateCenterId();

  const hashed = await passwordServices.hashPassword(payload.password);

  const center = await CenterModel.create({
    ...payload,
    centerId,
    password: hashed,
  });

  return { center };
};

const login = async (centerId: string, password: string) => {
  log.info("Logging in center");

  centerId = centerId.trim().toUpperCase();

  const center = await CenterModel.findOne({ centerId });

  if (!center) throw new HttpError(401, "Invalid credentials");

  if (!center.verified) throw new HttpError(401, "Center not verified");
  if (center.status === "suspended")
    throw new HttpError(401, "Center is suspended");

  const match = await passwordServices.verifyPassword(
    password,
    String(center.password)
  );

  if (!match) throw new HttpError(401, "Invalid Password");

  const token = jwt.sign(
    { sub: center._id, role: Roles.CENTER },
    config.jwtSecret,
    { expiresIn: "7d" }
  );

  // Sanitize response
  const { password: _, ...safeCenter } = center.toObject();

  return { center: safeCenter, token };
};

export const CenterService = { register, login };
