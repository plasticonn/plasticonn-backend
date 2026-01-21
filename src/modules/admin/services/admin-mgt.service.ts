import { EmailService } from "../../../common/email/email.service";
import { adminInviteTemplate } from "../../../common/email/templates";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { passwordServices } from "../../../common/utils/password";
import { addLog } from "../../activity_logs/Logs.service";
import { AdminModel } from "../admin.model";

const log = new Logger("adminManagement");

const addAdmin = async (payload: any) => {
  log.info("Adding admin");

  const adminExists = await AdminModel.findOne({ email: payload.email });

  if (adminExists) throw new HttpError(409, "Admin already added");

  const password = passwordServices.generatePassword(6);

  const hashed = await passwordServices.hashPassword(password);

  const admin = await AdminModel.create({
    ...payload,
    password: hashed,
  });

  await EmailService.sendEmail({
    to: payload.email,
    subject: "Admin Invite",
    html: adminInviteTemplate({
      name: payload.name,
      password: password,
    }),
  });

  return { admin };
};

const getAdmin = async (adminId: string) => {
  log.info("Fetching admin profile");

  const admin = await AdminModel.findById(adminId).select("-password");

  if (!admin) throw new HttpError(404, "Admin not found");

  return { admin };
};

const updateAdmin = async (adminId: string, payload: any) => {
  log.info("Updating admin profile");

  const admin = await AdminModel.findById(adminId);

  if (!admin) throw new HttpError(404, "Admin not found");

  Object.assign(admin, payload);

  await admin.save();

  return { admin };
};

const updateStatus = async (adminId: string, status: string) => {
  log.info("Updating admin status");

  const admin = await AdminModel.findById(adminId);

  if (!admin) throw new HttpError(404, "Admin not found");

  await addLog({
    type: "Status update",
    admin: "Super admin",
    action: `Admin status has been updated to ${status}`,
    userId: adminId,
    userType: "Admins",
  });

  Object.assign(admin, status);

  await admin.save();

  return { admin };
};

const removeAdmin = async (adminId: string) => {
  log.info("Deleting admin");

  const admin = await AdminModel.findByIdAndDelete(adminId);

  if (!admin) {
    throw new HttpError(404, "Admin not found");
  }

  return { message: "Admin deleted successfully" };
};

const getAdmins = async () => {
  log.info("Getting all admin");

  const admins = await AdminModel.find().select("-password");

  if (admins.length <= 0) throw new HttpError(404, "No admins found");

  return { admins };
};

export const adminServices = {
  addAdmin,
  getAdmin,
  getAdmins,
  updateAdmin,
  updateStatus,
  removeAdmin,
};
