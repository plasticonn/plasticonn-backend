import bcrypt from "bcrypt";
import { EmailService } from "../../common/email/email.service";
import { HttpError } from "../../common/utils/HttpError";
import { otpServices } from "../../common/utils/otp/otp";
import { OtpModel } from "../../common/utils/otp/otp.model";
import { passwordServices } from "../../common/utils/password";
import { CollectorsModel } from "../collectors/collectors.model";
import { findUserByEmail } from "../../common/utils/user-resolver";
import { Logger } from "../../common/logger/logger";
import { CenterModel } from "../centers/centers.model";

const log = new Logger("AuthService");

const forgotPassword = async (email: string) => {
  const resolved = await findUserByEmail(email);

  if (!resolved) {
    return "If the email exists, an OTP has been sent";
  }

  const otp = otpServices.generateOtp();
  await otpServices.storeOtp(email, otp);

  await EmailService.sendEmail({
    to: email,
    subject: "Password Recovery",
    html: `
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  return "If the email exists, an OTP has been sent";
};

const confirmPasswordReset = async (email: string, otp_code: string) => {
  const isValid = await otpServices.verifyOtp(email, otp_code);

  if (!isValid) {
    throw new HttpError(400, "Invalid or expired OTP");
  }

  await OtpModel.findOneAndUpdate({ email, otp_code }, { used: true });

  return "OTP verified";
};

const resetPassword = async (
  email: string,
  otp_code: string,
  password: string,
) => {
  const otp = await OtpModel.findOne({
    email,
    otp_code,
    used: true,
  });

  if (!otp) {
    throw new HttpError(400, "OTP not verified");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const hashed = await passwordServices.hashPassword(password);

  user.password = hashed;

  user.save();

  await OtpModel.deleteMany({ email });

  return "Password reset successfully";
};

const changePassword = async (
  userId: string,
  curPassword: string,
  role: "collector" | "center",
) => {
  log.info("Change password initialized");

  let user: any;

  // Fetch user based on role
  if (role === "collector") {
    user = await CollectorsModel.findById(userId);
    if (!user) throw new HttpError(404, "Collector not found");
  } else if (role === "center") {
    user = await CenterModel.findById(userId);
    if (!user) throw new HttpError(404, "Center not found");
  }

  // Verify current password
  const match = await passwordServices.verifyPassword(
    curPassword,
    user.password,
  );

  if (!match) throw new HttpError(422, "Invalid password");

  // Generate OTP
  const otp = otpServices.generateOtp();

  // Determine email
  const email = role === "center" ? user.contactEmail : user.email;

  await otpServices.storeOtp(String(email), otp);

  await EmailService.sendEmail({
    to: String(email),
    subject: "Change password",
    html: `
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  return "If the email exists, an OTP has been sent";
};

const verifyPasswordUpdate = async (
  userId: string,
  role: "collector" | "center",
  payload: { otp: string; newPassword: string },
) => {
  log.info("Verify password change");

  let user: any;

  // Fetch user based on role
  if (role === "collector") {
    user = await CollectorsModel.findById(userId);
    if (!user) throw new HttpError(404, "Collector not found");
  } else if (role === "center") {
    user = await CenterModel.findById(userId);
    if (!user) throw new HttpError(404, "Center not found");
  }

  if (!user) throw new HttpError(404, `${role} not found`);

  const email = role === "center" ? user.contactEmail : user.email;

  const verify = await otpServices.verifyOtp(String(email), payload.otp);

  if (verify.error) {
    throw new HttpError(400, verify.error);
  }

  const password = await passwordServices.hashPassword(payload.newPassword);

  user.password = password;

  await user.save();

  return {
    message: "Password updated successfully",
  };
};

export const AuthServices = {
  forgotPassword,
  confirmPasswordReset,
  resetPassword,
  changePassword,
  verifyPasswordUpdate,
};
