import { Schema, Types, model } from "mongoose";

const BlogSchema = new Schema(
  {
    image: {
      url: String,
      public_id: String,
    },
    title: { type: String },
    content: { type: String },
    author: { type: String },
    role: { type: String },
    status: { type: String, default: "draft" },
  },
  { timestamps: true },
);

export const BlogModel = model("Blogs", BlogSchema);
