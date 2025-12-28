import otpGenerator from "otp-generator";
import { OtpModel } from "./otp.model";

const generateOtp = () => {
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  return otp;
};

const storeOtp = async (email: string, otp_code: string) => {
  const expiresIn = 5 * 60 * 1000; // OTP expires in 5 minutes
  const expiresAt = new Date(Date.now() + expiresIn);

  await OtpModel.create({ email, otp_code, expiresAt });
};

const verifyOtp = async (email: string, otp_code: string) => {
  const otpEntry = await OtpModel.findOne({
    where: { email, otp_code },
  });

  if (otpEntry?.used) {
    return { error: "OTP expired" };
  }

  if (otpEntry?.expiresAt) {
    if (new Date() > otpEntry.expiresAt) {
      return { error: "OTP expired" };
    }
  } else {
    return { error: "Invalid OTP" };
  }

  return { success: "Account verified" };
};

export const otpServices = { generateOtp, storeOtp, verifyOtp };
