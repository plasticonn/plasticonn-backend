import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../common/utils/cloudinary";
import { HttpError } from "../../common/utils/HttpError";
import { PartnersModel } from "./partners.model";

const getPartners = async () => {
  return await PartnersModel.find();
};

const addPartner = async (file: Express.Multer.File, name: string) => {
  if (!file) throw new HttpError(400, "Logo required");

  const uploaded: any = await uploadToCloudinary(file);

  return await PartnersModel.create({
    name,
    logo: {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    },
  });
};

const removePartner = async (id: string) => {
  const partner = await PartnersModel.findById(id);

  if (!partner) throw new HttpError(404, "Partner not found");

  if (partner.logo?.public_id) {
    await deleteFromCloudinary(partner.logo.public_id);
  }

  await partner.deleteOne();

  return { message: "Partner removed" };
};

export const PartnerService = {
  getPartners,
  addPartner,
  removePartner,
};
