// blog.service.ts
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../common/utils/cloudinary";
import { HttpError } from "../../common/utils/HttpError";
import { BlogModel } from "./blog.model";

// ── helpers ───────────────────────────────────────────────────────────────────

const calcReadTime = (content: { type: string; text: string }[]): string => {
  const words = content
    .filter((b) => b.type === "paragraph")
    .reduce((sum, b) => sum + b.text.trim().split(/\s+/).length, 0);
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const formatViews = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k views` : `${n} views`;

const formatBlog = (blog: any) => ({
  id: blog._id,
  title: blog.title,
  subtitle: blog.subtitle,
  content: blog.content,
  image: blog.image?.url,
  imageCaption: blog.imageCaption,
  tags: blog.tags ?? [],
  publishedAt: blog.publishedAt
    ? blog.publishedAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null,
  readTime: blog.readTime,
  views: formatViews(blog.views),
  status: blog.status,
  author: {
    name: blog.author,
    role: blog.role,
    bio: blog.bio,
    initials:
      blog.author
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase() ?? "?",
  },
});

// ── service methods ───────────────────────────────────────────────────────────

const getBlogs = async () => {
  const blogs = await BlogModel.find().sort({ createdAt: -1 });
  return blogs.map(formatBlog);
};

const getBlog = async (id: string) => {
  const blog = await BlogModel.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true },
  );
  if (!blog) throw new HttpError(404, "Blog not found");
  return formatBlog(blog);
};

const addBlog = async (file: Express.Multer.File, payload: any) => {
  if (!file) throw new HttpError(400, "Image required");

  // content arrives as JSON string from multipart/form-data
  const content =
    typeof payload.content === "string"
      ? JSON.parse(payload.content)
      : (payload.content ?? []);

  const tags =
    typeof payload.tags === "string"
      ? JSON.parse(payload.tags)
      : (payload.tags ?? []);

  const uploaded: any = await uploadToCloudinary(file);

  const blog = await BlogModel.create({
    title: payload.title,
    subtitle: payload.subtitle,
    imageCaption: payload.imageCaption,
    author: payload.author,
    role: payload.role,
    bio: payload.bio,
    content,
    tags,
    readTime: calcReadTime(content),
    image: {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    },
  });

  return formatBlog(blog);
};

const updateBlog = async (
  id: string,
  file: Express.Multer.File | undefined,
  payload: any,
) => {
  const blog = await BlogModel.findById(id);
  if (!blog) throw new HttpError(404, "Blog not found");

  const content = payload.content
    ? typeof payload.content === "string"
      ? JSON.parse(payload.content)
      : payload.content
    : blog.content;

  const tags = payload.tags
    ? typeof payload.tags === "string"
      ? JSON.parse(payload.tags)
      : payload.tags
    : blog.tags;

  let image = blog.image;
  if (file) {
    if (blog.image?.public_id) await deleteFromCloudinary(blog.image.public_id);
    const uploaded: any = await uploadToCloudinary(file);
    image = { url: uploaded.secure_url, public_id: uploaded.public_id };
  }

  const updated = await BlogModel.findByIdAndUpdate(
    id,
    {
      ...payload,
      content,
      tags,
      image,
      readTime: calcReadTime(content),
    },
    { new: true },
  );

  return formatBlog(updated);
};

const removeBlog = async (id: string) => {
  const blog = await BlogModel.findById(id);
  if (!blog) throw new HttpError(404, "Blog not found");
  if (blog.image?.public_id) await deleteFromCloudinary(blog.image.public_id);
  await blog.deleteOne();
  return { message: "Blog removed" };
};

const publishBlog = async (id: string) => {
  const blog = await BlogModel.findByIdAndUpdate(
    id,
    { status: "published", publishedAt: new Date() }, // set publishedAt on publish
    { new: true },
  );
  if (!blog) throw new HttpError(404, "Blog not found");
  return { message: "Blog published", data: formatBlog(blog) };
};

export const BlogService = {
  getBlogs,
  getBlog, // new
  addBlog,
  updateBlog, // new
  removeBlog,
  publishBlog,
};
