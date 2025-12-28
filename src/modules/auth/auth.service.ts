import bcrypt from "bcryptjs/umd/types";
import { EmailService } from "../../common/email/email.service";
import { HttpError } from "../../common/utils/HttpError";
import { otpServices } from "../../common/utils/otp/otp";
import { OtpModel } from "../../common/utils/otp/otp.model";
import { passwordServices } from "../../common/utils/password";
import { CollectorsModel } from "../collectors/collectors.model";

const forgotPassword = async (email: string) => {
  const user = await CollectorsModel.findOne({ email });

  if (!user) {
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
  password: string
) => {
  const otp = await OtpModel.findOne({
    email,
    otp_code,
    used: true,
  });

  if (!otp) {
    throw new HttpError(400, "OTP not verified");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await CollectorsModel.findOneAndUpdate(
    { email },
    { password: hashedPass }
  );

  if (!user) throw new HttpError(404, "User not found");

  await OtpModel.deleteMany({ email });

  return "Password reset successfully";
};

export const AuthServices = {
  forgotPassword,
  confirmPasswordReset,
  resetPassword,
};
