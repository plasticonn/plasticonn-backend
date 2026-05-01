import { Router } from "express";
import { Logger } from "../../common/logger/logger";
import { upload } from "../../common/middleware/upload.middleware";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { PartnerService } from "./partners.service";

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Partners endpoints
 */

/**
 * @swagger
 * /api/partner:
 *   get:
 *     summary: Gets partners
 *     tags: [Partners]
 *     responses:
 *       200:
 *         description: Partners retrieved successfully
 */
const log = new Logger("PartnerController");
export const PartnerController = Router();

PartnerController.get("/", async (req, res) => {
  try {
    const data = await PartnerService.getPartners();
    res.json(ApiResponse(200, "Partners fetched", data));
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
 * /api/partner:
 *   post:
 *     summary: Add parnters
 *     tags: [Partners]
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
 *         description: Successfully added partner
 */
PartnerController.post("/", upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) {
      throw new HttpError(400, "Image file is required");
    }

    const partner = await PartnerService.addPartner(req.file, req.body.name);

    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse(201, "Partner added", partner));
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
 * /api/partner/{id}:
 *   delete:
 *     summary: Remove partner
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the partner to remove
 *     responses:
 *       200:
 *         description: Successfully removed partner
 */
PartnerController.delete("/:id", async (req, res) => {
  try {
    const result = await PartnerService.removePartner(req.params.id);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(201, "Partner removed", result.message));
  } catch (err: any) {
    log.error(err.message);

    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});
