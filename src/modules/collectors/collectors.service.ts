import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CollectorsModel } from "./collectors.model";
import { config } from "../../config";
import { Logger } from "../../common/logger/logger";
import { Roles } from "../../common/enum/roles.enum";
import { HttpError } from "../../common/utils/HttpError";
import { addLog } from "../activity_logs/Logs.service";
import { passwordServices } from "../../common/utils/password";
import { NotificationsModel } from "../notifications/notifications.model";
import { DropsModel } from "../drops/drops.model";
import { calculateCO2Saved } from "../../common/utils/co2saved";
import { EmailService } from "../../common/email/email.service";
import { otpServices } from "../../common/utils/otp/otp";
import { changePasswordTemplate } from "../../common/email/templates";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../common/utils/cloudinary";
import mongoose from "mongoose";

const log = new Logger("CollectorsService");

export const register = async (payload: any, file: Express.Multer.File) => {
  log.info("Registering collector");

  const collector = await CollectorsModel.findOne({
    email: payload.email.toLowerCase(),
  });

  if (collector) throw new HttpError(409, "Collector already exists");

  const hashed = await passwordServices.hashPassword(payload.password);

  let image: { url: string; public_id: string } | null = null;

  if (file) {
    const uploaded: any = await uploadToCloudinary(file);

    image = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };
  }

  const user = await CollectorsModel.create({
    ...payload,
    email: payload.contactEmail.toLowercase(),
    image,
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

  const user = await CollectorsModel.findOne({ email: email.toLowerCase() });

  if (!user) throw new HttpError(404, "Collector does not exist");

  //const match = await bcrypt.compare(password, String(user.password));

  if (user.status === "suspended")
    throw new HttpError(400, "Account suspended");

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

  if (collector.status === "suspended") {
    throw new HttpError(401, "Account suspended.");
  }

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

const getDashboardStats = async (user_id: string) => {
  const objectId = new mongoose.Types.ObjectId(user_id);

  const drops = await DropsModel.find({
    collector_id: objectId,
  });

  const acceptedDrops = drops.filter((drop) => drop.status === "accepted");

  const totalPlastics = acceptedDrops.reduce(
    (sum, drop) => sum + (drop.amount || 0),
    0,
  );

  const verifiedSubmissions = acceptedDrops.length;

  const totalSubmissions = drops.length;

  const co2Saved = calculateCO2Saved(totalPlastics);

  const rankResult = await DropsModel.aggregate([
    {
      $match: {
        status: "accepted",
      },
    },
    {
      $group: {
        _id: "$collector_id",
        totalPlastics: {
          $sum: "$amount",
        },
      },
    },
    {
      $setWindowFields: {
        sortBy: { totalPlastics: -1 },
        output: {
          rank: { $rank: {} },
        },
      },
    },
    {
      $match: {
        _id: objectId,
      },
    },
  ]);

  const rank = rankResult.length ? rankResult[0].rank : null;

  return {
    co2Saved,
    verifiedSubmissions,
    totalSubmissions,
    totalPlastics,
    rank,
  };
};
const updatePassword = async (collector_id: string, payload: any) => {
  log.info("Change password");

  const collector = await CollectorsModel.findById(collector_id);

  if (!collector) throw new HttpError(404, "Collector not found");

  const match = await passwordServices.verifyPassword(
    payload.curPassword,
    String(collector.password),
  );

  if (!match) throw new HttpError(422, "Invalid password");

  const otp = otpServices.generateOtp();

  await otpServices.storeOtp(String(collector.email), otp);

  await EmailService.sendEmail({
    to: String(collector.email),
    subject: "Password Change Confirmation",
    html: changePasswordTemplate({
      otp: otp,
    }),
  });
};

const verifyPasswordUpdate = async (collector_id: string, payload: any) => {
  log.info("Verify password change");

  const collector = await CollectorsModel.findById(collector_id);

  if (!collector) throw new HttpError(404, "Collector not found");

  const verify = await otpServices.verifyOtp(
    String(collector.email),
    payload.otp,
  );

  if (verify.error) {
    throw new HttpError(400, verify.error);
  }

  const password = await passwordServices.hashPassword(payload.newPassword);

  collector.password = password;

  await collector.save();

  return { collector };
};

const updateProfilePicture = async (
  centerId: string,
  file: Express.Multer.File,
) => {
  if (!file) throw new HttpError(400, "Image is required");

  const uploaded: any = await uploadToCloudinary(file);

  const center = await CollectorsModel.findByIdAndUpdate(
    centerId,
    {
      image: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      },
    },
    { new: true },
  );

  return center;
};

const removeProfilePicture = async (collectorId: string) => {
  const collector = await CollectorsModel.findById(collectorId);

  if (!collector) {
    throw new HttpError(404, "collector not found");
  }

  // If no image, nothing to delete
  if (!collector.image || !collector.image.public_id) {
    return collector;
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(collector.image.public_id);

  // Remove from DB
  collector.image = null;
  await collector.save();

  return collector;
};

export const CollectorsService = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  getDashboardStats,
  updatePassword,
  verifyPasswordUpdate,
  updateProfilePicture,
  removeProfilePicture,
};
