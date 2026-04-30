import mongoose, { Schema, Types, model } from "mongoose";

const DropsSchema = new Schema(
  {
    drop_id: { type: String },

    collector_id: { type: mongoose.Schema.Types.ObjectId, ref: "Collectors" },
    center_id: { type: mongoose.Schema.Types.ObjectId, ref: "Centers" },
    amount: { type: Number },
    types: { type: [String] },
    condition: { type: String },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export const DropsModel = model("Drops", DropsSchema);
