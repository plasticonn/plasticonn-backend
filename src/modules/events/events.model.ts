import { Schema, model } from "mongoose";

const EventsSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    category: { type: String },
    date: { type: String },
    time: { type: String },
  },
  { timestamps: true }
);

export const EventsModel = model("Events", EventsSchema);
