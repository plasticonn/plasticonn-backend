import { Schema, model } from "mongoose";

const CollectorsSchema = new Schema(
  {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    co2Saved: { type: Number },
  },
  { timestamps: true }
);

export const CollectorsModel = model("Collectors", CollectorsSchema);
