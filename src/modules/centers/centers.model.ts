import { Schema, model } from "mongoose";

const CenterSchema = new Schema(
  {
    centerId: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String },
    password: { type: String },
    gps: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    contactPerson: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    materialsAccepted: [String],
    capacity: { type: String },
    //operatingHours: { type: String },
    type: {
      type: String,
      enum: [
        "Informal Collection Center",
        "Formal Collection",
        "Recycling center",
      ],
    },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true }
);

export const CenterModel = model("Centers", CenterSchema);
