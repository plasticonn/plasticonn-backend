import { CollectorsModel } from "../../modules/collectors/collectors.model";
import { CenterModel } from "../../modules/centers/centers.model";
import { AdminModel } from "../../modules/admin/admin.model";

export const findUserByEmail = async (email: string) => {
  const collector = await CollectorsModel.findOne({ email });
  if (collector) return collector;

  const center = await CenterModel.findOne({ contactEmail: email });
  if (center) return center;

  const admin = await AdminModel.findOne({ email });
  if (admin) return admin;

  return null;
};
