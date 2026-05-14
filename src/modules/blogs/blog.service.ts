import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../common/utils/cloudinary";
import { HttpError } from "../../common/utils/HttpError";
import { BlogModel } from "./blog.model";

const getBlogs = async () => {
  return await BlogModel.find();
};

const addBlog = async (file: Express.Multer.File, payload: any) => {
  if (!file) throw new HttpError(400, "Logo required");

  const uploaded: any = await uploadToCloudinary(file);

  return await BlogModel.create({
    ...payload,
    image: {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    },
  });
};

const removeBlog = async (id: string) => {
  const blog = await BlogModel.findById(id);

  if (!blog) throw new HttpError(404, "Blog not found");

  if (blog.image?.public_id) {
    await deleteFromCloudinary(blog.image.public_id);
  }

  await blog.deleteOne();

  return { message: "Blog removed" };
};

const publishBlog = async (id: string) => {
  const blog = await BlogModel.findByIdAndUpdate(
    id,
    {
      status: "published",
    },
    { new: true },
  );

  return { message: "Blog published" };
};

export const BlogService = {
  getBlogs,
  addBlog,
  removeBlog,
  publishBlog,
};
