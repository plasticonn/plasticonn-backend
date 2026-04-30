import { Schema, model } from "mongoose";

const CenterSchema = new Schema(
  {
    centerId: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, default: "center" },
    address: { type: String },
    password: { type: String },
    gps: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
    },
    contactPerson: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    materialsAccepted: [String],
    capacity: { type: String },
    //operatingHours: { type: String },
    centerType: {
      type: String,
      enum: ["collection", "recycling"],
    },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    documents: [
      {
        url: String,
        public_id: String,
      },
    ],
    formal: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true },
);

CenterSchema.index({ gps: "2dsphere" });

export const CenterModel = model("Centers", CenterSchema);
