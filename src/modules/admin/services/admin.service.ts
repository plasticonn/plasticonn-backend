import jwt from "jsonwebtoken";
import { AdminModel } from "../admin.model";
import { config } from "../../../config";
import { Logger } from "../../../common/logger/logger";
import { Roles } from "../../../common/enum/roles.enum";
import { HttpError } from "../../../common/utils/HttpError";
import { passwordServices } from "../../../common/utils/password";
import { tokenService } from "../../../common/utils/token/token.service";
import { otpServices } from "../../../common/utils/otp/otp";
import { EmailService } from "../../../common/email/email.service";
import { changePasswordTemplate } from "../../../common/email/templates";
import bcrypt from "bcrypt";

const log = new Logger("AdminService");

export const loginSuperAdmin = async (email: string, password: string) => {
  log.info("logging in super admin");

  const admin = await AdminModel.findOne({ email });

  if (!admin) throw new HttpError(404, "Admin does not exist");

  const match = await passwordServices.verifyPassword(
    password,
    String(admin.password),
  );

  if (!match) throw new HttpError(422, "Invalid password");

  const accessToken = tokenService.generateAccessToken({
    userId: String(admin?._id),
    role: String(admin?.role),
  });

  const refreshToken = await tokenService.generateRefreshToken({
    userId: String(admin?._id),
    role: Roles.SUPER_ADMIN,
  });

  return { admin, accessToken, refreshToken };
};

const login = async (email: string, password: string) => {
  log.info("logging in admin");

  const admin = await AdminModel.findOne({ email }).select("+password");

  if (!admin) throw new HttpError(404, "Admin does not exist");

  //const match = await bcrypt.compare(password, String(admin.password));

  const match = await passwordServices.verifyPassword(
    password,
    String(admin.password),
  );

  if (!match) throw new HttpError(422, "Invalid password");

  const token = jwt.sign(
    { sub: admin._id, role: admin.role },
    config.jwtSecret,
    {
      expiresIn: "7d",
    },
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

const updatePassword = async (adminId: string, payload: any) => {
  log.info("Change password");

  const admin = await AdminModel.findById(adminId);

  if (!admin) throw new HttpError(404, "Admin not found");

  const match = await passwordServices.verifyPassword(
    payload.curPassword,
    String(admin.password),
  );

  if (!match) throw new HttpError(422, "Invalid password");

  const otp = otpServices.generateOtp();

  await otpServices.storeOtp(String(admin.email), otp);

  await EmailService.sendEmail({
    to: String(admin.email),
    subject: "Password Change Confirmation",
    html: changePasswordTemplate({ name: String(admin.name), otp: otp }),
  });
};

const verifyPasswordUpdate = async (adminId: string, payload: any) => {
  log.info("Verify password change");

  const admin = await AdminModel.findById(adminId);

  if (!admin) throw new HttpError(404, "Admin not found");

  const verify = await otpServices.verifyOtp(String(admin.email), payload.otp);

  if (verify.error) {
    throw new HttpError(400, verify.error);
  }

  console.log(payload.newPassword);

  const password = await passwordServices.hashPassword(payload.newPassword);

  admin.password = password;

  await admin.save();

  return { admin };
};

export const AdminService = {
  login,
  getProfile,
  updateProfile,
  updatePassword,
  verifyPasswordUpdate,
};
