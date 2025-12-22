import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: { type: String, allowNull: false },
    message: { type: String, allowNull: false },
    user_id: { type: String, allowNull: true },
    type: { type: String, default: "individual" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationsModel = model("Notifications", NotificationSchema);
