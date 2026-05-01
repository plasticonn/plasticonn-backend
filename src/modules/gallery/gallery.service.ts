import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../common/utils/cloudinary";
import { HttpError } from "../../common/utils/HttpError";
import { GalleryModel } from "./gallery.model";

const getGallery = async () => {
  return await GalleryModel.find().sort({ timestamp: -1 });
};

const addPhoto = async (files: Express.Multer.File[], event: string) => {
  if (!files || files.length === 0) {
    throw new HttpError(400, "No images provided");
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const uploaded: any = await uploadToCloudinary(file);

      return {
        image: {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        },
        event,
        timestamp: new Date(),
      };
    }),
  );

  const photos = await GalleryModel.insertMany(uploads);

  return photos;
};

const removePhoto = async (id: string) => {
  const photo = await GalleryModel.findById(id);

  if (!photo) throw new HttpError(404, "Photo not found");

  if (photo.image?.public_id) {
    await deleteFromCloudinary(photo.image.public_id);
  }

  await photo.deleteOne();

  return { message: "Photo removed" };
};

export const GalleryService = {
  getGallery,
  addPhoto,
  removePhoto,
};
