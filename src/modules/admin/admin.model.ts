import { Schema, model } from "mongoose";

const AdminSchema = new Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ["super admin", "admin"] },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true }
);

export const AdminModel = model("Admins", AdminSchema);
