import { Schema, model } from "mongoose";

const OtpSchema = new Schema(
  {
    email: { type: String },
    otp_code: { type: String },
    category: { type: String },
    used: { type: Boolean, default: false },
    expiresAt: { type: Date, require: true },
  },
  { timestamps: true }
);

export const OtpModel = model("Otps", OtpSchema);
