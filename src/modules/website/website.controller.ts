import { Router } from "express";
import { Website } from "./website.service";
import { Logger } from "../../common/logger/logger";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpError } from "../../common/utils/HttpError";

/**
 * @swagger
 * tags:
 *   name: Website
 *   description: Website endpoints
 */

const log = new Logger("WebsiteController");
export const WebsiteController = Router();

/**
 * @swagger
 * /api/website:
 *   get:
 *     summary: Gets website data
 *     tags: [Website]
 *     responses:
 *       200:
 *         description: Website data retrieved successfully
 */
WebsiteController.get("/", async (req, res) => {
  try {
    const result = await Website.websiteData();

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse(HttpStatus.OK, "Website data returned", result));
  } catch (err: any) {
    log.error(err.message);
    if (err instanceof HttpError) {
      return res.status(err.status).json(ApiResponse(err.status, err.message));
    }

    return res.status(500).json(ApiResponse(500, "Internal server error"));
  }
});
