import jwt from "jsonwebtoken";
import { AdminModel } from "../admin.model";
import { config } from "../../../config";
import { Logger } from "../../../common/logger/logger";
import { Roles } from "../../../common/enum/roles.enum";
import { HttpError } from "../../../common/utils/HttpError";
import { passwordServices } from "../../../common/utils/password";
import { tokenService } from "../../../common/utils/token/token.service";

const log = new Logger("AdminService");

export const loginSuperAdmin = async (email: string, password: string) => {
  log.info("logging in super admin");

  const admin = await AdminModel.findOne({ email });

  if (!admin) throw new HttpError(404, "Admin does not exist");

  const match = await passwordServices.verifyPassword(
    password,
    String(admin.password)
  );

  if (!match) throw new HttpError(401, "Invalid password");

  const accessToken = tokenService.generateAccessToken({
    userId: String(admin?._id),
    role: Roles.SUPER_ADMIN,
  });

  const refreshToken = await tokenService.generateRefreshToken({
    userId: String(admin?._id),
    role: Roles.SUPER_ADMIN,
  });

  return { admin, accessToken, refreshToken };
};

const login = async (email: string, password: string) => {
  log.info("logging in admin");

  const admin = await AdminModel.findOne({ email });

  if (!admin) throw new HttpError(404, "Admin does not exist");

  const match = await passwordServices.verifyPassword(
    password,
    String(admin.password)
  );

  if (!match) throw new HttpError(401, "Invalid password");

  const token = jwt.sign(
    { sub: admin._id, role: Roles.ADMIN },
    config.jwtSecret,
    {
      expiresIn: "7d",
    }
  );

  return { admin, token };
};

const getProfile = async (adminId: string) => {
  log.info("Fetching admin profile");

  const admin = await AdminModel.findById(adminId).select("-password");

  if (!admin) throw new HttpError(404, "Admin not found");

  return { admin };
};

const updateProfile = async (adminId: string, payload: any) => {
  log.info("Updating admin profile");

  const admin = await AdminModel.findById(adminId);

  if (!admin) throw new HttpError(404, "Admin not found");

  Object.assign(admin, payload);

  await admin.save();

  return { admin };
};

export const AdminService = {
  login,
  getProfile,
  updateProfile,
};
