import { Schema, model, Types } from "mongoose";

const LogsSchema = new Schema(
  {
    type: { type: String },
    admin: { type: String },
    action: { type: String },
    userId: {
      type: Types.ObjectId,
      refPath: "userType",
    },

    userType: {
      type: String,
      enum: ["Collectors", "Admins", "Centers"],
    },
  },
  { timestamps: true },
);

export const LogsModel = model("Logs", LogsSchema);
