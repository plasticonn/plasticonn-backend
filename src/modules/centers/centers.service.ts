import { Roles } from "../../common/enum/roles.enum";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";
import { passwordServices } from "../../common/utils/password";
import { CenterModel } from "./centers.model";
import { config } from "../../config";
import jwt from "jsonwebtoken";
import { generateCenterId } from "../../common/utils/generateCode";
import { addLog } from "../activity_logs/Logs.service";
import { DropsModel } from "../drops/drops.model";
import mongoose from "mongoose";
import { EmailService } from "../../common/email/email.service";
import { changePasswordTemplate } from "../../common/email/templates";
import { otpServices } from "../../common/utils/otp/otp";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../common/utils/cloudinary";

const log = new Logger("CenterService");

const register = async (
  payload: any,
  files?: {
    image?: Express.Multer.File[];
    documents?: Express.Multer.File[];
  },
) => {
  log.info("Registering center");

  const parsedPayload = {
    ...payload,
    email: payload.email.toLowerCase(),
    lng: Number(payload.lng),
    lat: Number(payload.lat),
    formal: payload.formal === "true",
    materialsAccepted: Array.isArray(payload.materialsAccepted)
      ? payload.materialsAccepted
      : JSON.parse(payload.materialsAccepted || "[]"),
  };

  const centerExists = await CenterModel.findOne({ name: payload.name });
  if (centerExists) throw new HttpError(409, "Center already exists");

  const centerId = generateCenterId();
  const hashed = await passwordServices.hashPassword(payload.password);

  let image: { url: string; public_id: string } | null = null;
  let documents: { url: string; public_id: string }[] = [];

  if (files?.documents?.length) {
    const uploads = await Promise.all(
      files.documents.map(async (doc) => {
        const uploaded: any = await uploadToCloudinary(doc);
        return {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        };
      }),
    );

    documents = uploads;
  }

  if (files?.image?.[0]) {
    const uploaded: any = await uploadToCloudinary(files.image[0]);

    image = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };
  }

  const { lat, lng, password, ...rest } = parsedPayload;

  const center = await CenterModel.create({
    ...rest,
    centerId,
    password: hashed,
    image,
    documents,
    gps: {
      type: "Point",
      coordinates: [lng, lat],
    },
  });

  const token = jwt.sign(
    { sub: payload.email, role: Roles.CENTER },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

  await addLog({
    type: "User registration",
    admin: null,
    action: `A new center ${payload.email} just registered`,
  });

  return { center, token };
};

const login = async (centerId: string, password: string) => {
  log.info("Logging in center");

  centerId = centerId.trim().toUpperCase();

  const center = await CenterModel.findOne({ centerId });

  if (!center) throw new HttpError(422, "Center not found");

  if (!center.verified) throw new HttpError(403, "Center not verified");
  if (center.status === "suspended")
    throw new HttpError(403, "Center is suspended");

  const match = await passwordServices.verifyPassword(
    password,
    String(center.password),
  );

  if (!match) throw new HttpError(422, "Invalid Password");

  const token = jwt.sign(
    { sub: center._id, role: Roles.CENTER },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

  // Sanitize response
  const { password: _, ...safeCenter } = center.toObject();

  return { center: safeCenter, token };
};

const getProfile = async (centerId: string) => {
  log.info("Fetching center profile");

  const center = await CenterModel.findById(centerId).select("-password");

  if (!center) throw new HttpError(404, "Center not found");

  if (center.status === "suspended") {
    throw new HttpError(401, "Account suspended.");
  }

  return { center };
};

const updateProfile = async (centerId: string, payload: any) => {
  log.info("Updating center profile");

  const center = await CenterModel.findById(centerId);

  if (!center) throw new HttpError(404, "Center not found");

  Object.assign(center, payload);

  await center.save();

  return { center };
};

const deleteAccount = async (centerId: string) => {
  log.info("Deleting center");

  const center = await CenterModel.findByIdAndDelete(centerId);

  if (!center) {
    throw new HttpError(404, "Center not found");
  }

  await addLog({
    type: "Account deletion",
    admin: null,
    action: "A center has deleted their account",
    userId: centerId,
    userType: "Centers",
  });

  return { message: "Center deleted successfully" };
};

const getCenters = async () => {
  log.info("Getting all centers");

  const centers = await CenterModel.find().select("-password");

  if (centers.length <= 0) throw new HttpError(404, "No centers found");

  return { centers };
};

const getClosestCenters = async (lat: number, lng: number, limit = 5) => {
  log.info("Getting closest centers");

  const centers = await CenterModel.find({
    gps: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    },
  })
    .select("-password")
    .limit(limit);

  if (centers.length <= 0) throw new HttpError(404, "No centers found");

  return { centers };
};

const getCenterStats = async (center_id: string) => {
  log.info("get center stats");

  const now = new Date();

  const todayStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
    ),
  );

  const todayEnd = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );

  const [verifiedDrops, pendingDrops, todayDrops, plasticsResult] =
    await Promise.all([
      // Verified drops
      DropsModel.countDocuments({
        center_id,
        status: { $in: ["accepted", "verified"] },
      }),

      // Pending drops
      DropsModel.countDocuments({
        center_id,
        status: "pending",
      }),

      // Today's drops
      DropsModel.countDocuments({
        center_id,
        createdAt: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      }),

      // Total plastics collected
      DropsModel.aggregate([
        { $match: { center_id: new mongoose.Types.ObjectId(center_id) } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

  const totalPlastics = plasticsResult[0]?.total || 0;

  const CO2_PER_KG = 1.5; // kg of CO2 saved per kg of plastic recycled
  const AVG_PLASTIC_WEIGHT_KG = 0.01; // average weight of one plastic item (10g)

  const weightKg = totalPlastics * AVG_PLASTIC_WEIGHT_KG;
  const totalCO2Saved = weightKg * CO2_PER_KG;

  return {
    verifiedDrops,
    pendingDrops,
    todayDrops,
    totalCO2Saved,
  };
};

const updatePassword = async (center_id: string, payload: any) => {
  log.info("Change password");

  const center = await CenterModel.findById(center_id);

  if (!center) throw new HttpError(404, "Center not found");

  const match = await passwordServices.verifyPassword(
    payload.curPassword,
    String(center.password),
  );

  if (!match) throw new HttpError(422, "Invalid password");

  const otp = otpServices.generateOtp();

  await otpServices.storeOtp(String(center.contactEmail), otp);

  await EmailService.sendEmail({
    to: String(center.contactEmail),
    subject: "Password Change Confirmation",
    html: changePasswordTemplate({
      otp: otp,
    }),
  });
};

const verifyPasswordUpdate = async (center_id: string, payload: any) => {
  log.info("Verify password change");

  const center = await CenterModel.findById(center_id);

  if (!center) throw new HttpError(404, "Center not found");

  const verify = await otpServices.verifyOtp(
    String(center.contactEmail),
    payload.otp,
  );

  if (verify.error) {
    throw new HttpError(400, verify.error);
  }

  const password = await passwordServices.hashPassword(payload.newPassword);

  center.password = password;

  await center.save();

  return { center };
};

const updateProfilePicture = async (
  centerId: string,
  file: Express.Multer.File,
) => {
  if (!file) throw new HttpError(400, "Image is required");

  const uploaded: any = await uploadToCloudinary(file);

  const center = await CenterModel.findByIdAndUpdate(
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

const removeProfilePicture = async (centerId: string) => {
  const center = await CenterModel.findById(centerId);

  if (!center) {
    throw new HttpError(404, "Center not found");
  }

  // If no image, nothing to delete
  if (!center.image) {
    return center;
  }

  // Delete from Cloudinary
  center.image.public_id &&
    (await deleteFromCloudinary(center.image.public_id));

  // Remove from DB
  center.image = null;
  await center.save();

  return center;
};

export const CenterService = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  getCenters,
  getClosestCenters,
  getCenterStats,
  updatePassword,
  verifyPasswordUpdate,
  updateProfilePicture,
  removeProfilePicture,
};
