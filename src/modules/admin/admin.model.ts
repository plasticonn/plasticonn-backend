import { Schema, model } from "mongoose";

const AdminSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ["super_admin", "admin"] },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true },
);

export const AdminModel = model("Admins", AdminSchema);
