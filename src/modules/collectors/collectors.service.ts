import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CollectorsModel } from "./collectors.model";
import { config } from "../../config";
import { Logger } from "../../common/logger/logger";
import { Roles } from "../../common/enum/roles.enum";

const log = new Logger("CollectorsService");

export const register = async (payload: any) => {
  log.info("Registering collector");

  const hashed = await bcrypt.hash(payload.password, 10);

  const user = await CollectorsModel.create({
    ...payload,
    password: hashed,
  });

  const token = jwt.sign(
    { sub: payload.email, role: Roles.COLLECTOR },
    config.jwtSecret,
    {
      expiresIn: "7d",
    }
  );

  return { user, token };
};

export const login = async (email: string, password: string) => {
  log.info("logging in collector");

  const user = await CollectorsModel.findOne({ email });

  if (!user) throw new Error("Collector does not exist");

  const match = await bcrypt.compare(password, String(user.password));

  if (!match) throw new Error("Invalid password");

  const token = jwt.sign(
    { sub: user._id, role: Roles.COLLECTOR },
    config.jwtSecret,
    {
      expiresIn: "7d",
    }
  );

  return { user, token };
};

export const CollectorsService = {
  register,
  login,
};
