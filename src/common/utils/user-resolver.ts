import { CollectorsModel } from "../../modules/collectors/collectors.model";
import { CenterModel } from "../../modules/centers/centers.model";
import { AdminModel } from "../../modules/admin/admin.model";

export const findUserByEmail = async (email: string) => {
  const collector = await CollectorsModel.findOne({ email });
  if (collector) {
    return {
      user: collector,
      updatePassword: (hashedPassword: string) =>
        CollectorsModel.updateOne({ email }, { password: hashedPassword }),
    };
  }

  const center = await CenterModel.findOne({ contactEmail: email });
  if (center) {
    return {
      user: center,
      updatePassword: (hashedPassword: string) =>
        CenterModel.updateOne(
          { contactEmail: email },
          { password: hashedPassword },
        ),
    };
  }

  const admin = await AdminModel.findOne({ email });
  if (admin) {
    return {
      user: admin,
      updatePassword: (hashedPassword: string) =>
        AdminModel.updateOne({ email }, { password: hashedPassword }),
    };
  }

  return null;
};
