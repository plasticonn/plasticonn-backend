// blog.model.ts
import { Schema, model } from "mongoose";

const ContentBlockSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["paragraph", "heading", "blockquote"],
      required: true,
    },
    text: { type: String, required: true },
  },
  { _id: false },
);

const BlogSchema = new Schema(
  {
    image: {
      url: String,
      public_id: String,
    },
    imageCaption: { type: String },
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: [ContentBlockSchema], default: [] },
    tags: [{ label: String, color: String, bg: String }],
    author: { type: String, required: true },
    role: { type: String },
    bio: { type: String },
    readTime: { type: String },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

export const BlogModel = model("Blogs", BlogSchema);
