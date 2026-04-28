import { Schema, model } from "mongoose";

const CollectorsSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    role: { type: String, default: "collector" },
    status: { type: String, default: "active", enum: ["active", "suspended"] },
  },
  { timestamps: true },
);

export const CollectorsModel = model("Collectors", CollectorsSchema);
