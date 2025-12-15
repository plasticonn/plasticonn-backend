import { Schema, model } from "mongoose";

const DropsSchema = new Schema(
  {
    collector_id: { type: String },
    center_id: { type: String },
    amount: { type: Number },
    types: { type: String },
    condition: { type: String },
    location: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DropsModel = model("Drops", DropsSchema);
