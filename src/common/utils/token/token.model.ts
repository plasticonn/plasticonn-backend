import { Schema, model } from "mongoose";

const TokenSchema = new Schema(
  {
    user_id: { type: String },
    token: { type: String },
    used: { type: Boolean, default: "false" },
  },
  { timestamps: true }
);

export const TokenModel = model("Tokens", TokenSchema);
