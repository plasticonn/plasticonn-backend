import { Schema, Types, model } from "mongoose";

const PartnerSchema = new Schema(
  {
    logo: {
      url: String,
      public_id: String,
    },
    name: { type: String },
  },
  { timestamps: true },
);

export const PartnersModel = model("Partners", PartnerSchema);
