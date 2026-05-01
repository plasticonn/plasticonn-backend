import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { upload } from "../../common/middleware/upload.middleware";
import { ApiResponse } from "../../common/responses/api-response";
import { GalleryService } from "./gallery.service";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpStatus } from "../../common/enum/http-status.enum";

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Gallery endpoints
 */

const log = new Logger("GalleryController");
export const GalleryController = Router();

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Gets gallery
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: Gallery retrieved successfully
 */
GalleryController.get("/", async (req, res) => {
  try {
    const data = await GalleryService.getGallery();
    res.json(ApiResponse(200, "Gallery fetched", data));
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
 * /api/gallery:
 *   post:
 *     summary: Add photos to gallery
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               event:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added photos
 */
GalleryController.post(
  "/",
  verifyToken,
  checkRole(["super_admin", "admin"]),
  upload.array("images"),
  async (req, res) => {
    try {
      const result = await GalleryService.addPhoto(
        req.files as Express.Multer.File[],
        req.body.event,
      );

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse(201, "Photo added", result));
    } catch (err: any) {
      log.error(err.message);

      if (err instanceof HttpError) {
        return res
          .status(err.status)
          .json(ApiResponse(err.status, err.message));
      }

      return res.status(500).json(ApiResponse(500, "Internal server error"));
    }
  },
);

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete photo from gallery
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the photo to delete
 *     responses:
 *       200:
 *         description: Successfully deleted photo
 */
GalleryController.delete(
  "/:id",
  verifyToken,
  checkRole(["super_admin", "admin"]),
  async (req, res) => {
    try {
      const result = await GalleryService.removePhoto(req.params.id);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(201, "Photo deleted", result));
    } catch (err: any) {
      log.error(err.message);

      if (err instanceof HttpError) {
        return res
          .status(err.status)
          .json(ApiResponse(err.status, err.message));
      }

      return res.status(500).json(ApiResponse(500, "Internal server error"));
    }
  },
);
