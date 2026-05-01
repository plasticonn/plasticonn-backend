import { Schema, Types, model } from "mongoose";

const GallerySchema = new Schema(
  {
    image: {
      url: String,
      public_id: String,
    },
    event: { type: String },
  },
  { timestamps: true },
);

export const GalleryModel = model("Gallery", GallerySchema);
