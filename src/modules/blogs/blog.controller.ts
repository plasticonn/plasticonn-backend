import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { upload } from "../../common/middleware/upload.middleware";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { BlogService } from "./blog.service";

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs endpoints
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Gets blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 */
const log = new Logger("BlogController");
export const BlogController = Router();

BlogController.get("/", async (req, res) => {
  try {
    const data = await BlogService.getBlogs();
    res.json(ApiResponse(200, "Blogs fetched", data));
  } catch (err: any) {
    log.error(err.message);

    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});

BlogController.get("/:id", async (req, res) => {
  try {
    const data = await BlogService.getBlog(req.params.id);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(200, "Blog fetched", data));
  } catch (err: any) {
    log.error(err.message);
    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }
    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});

/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Add blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added blog
 */
BlogController.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      throw new HttpError(400, "Image file is required");
    }

    const blog = await BlogService.addBlog(req.file, req.body);

    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse(201, "Blog added", blog));
  } catch (err: any) {
    log.error(err.message);
    console.log(err);

    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});

/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to remove
 *     responses:
 *       200:
 *         description: Successfully removed blog
 */
BlogController.delete("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const result = await BlogService.removeBlog(req.params.id);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(201, "Blog removed", result.message));
  } catch (err: any) {
    log.error(err.message);

    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});

/**
 * @swagger
 * /api/blog/{id}:
 *   patch:
 *     summary: Publish blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to publish
 *     responses:
 *       200:
 *         description: Successfully published blog
 */
BlogController.patch("/:id", async (req, res) => {
  try {
    const result = await BlogService.publishBlog(req.params.id);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(201, "Blog published", result.message));
  } catch (err: any) {
    log.error(err.message);

    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});
