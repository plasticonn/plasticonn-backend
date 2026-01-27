import { Router } from "express";
import { AdminDownloadService } from "../services/download-report.service";
import { verifyToken } from "../../../common/middleware/auth.middleware";
import { checkRole } from "../../../common/middleware/role.middleware";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";
import { ApiResponse } from "../../../common/responses/api-response";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admins' endpoints
 */

const log = new Logger("AdminDownloadController");
export const AdminDownloadController = Router();

/**
 * @swagger
 * /api/admin/download-report:
 *   get:
 *     summary: Download datasets in various formats
 *     description: |
 *       Allows an admin to download platform data (centers, collectors, admins, etc.)
 *       in different formats such as CSV, Excel, PDF, or GeoJSON.
 *
 *       Additional query parameters can be used as filters.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataset
 *         required: true
 *         schema:
 *           type: string
 *           example: centers
 *         description: Dataset to download (e.g. centers, collectors, drop offs)
 *
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, excel, pdf, geojson]
 *           example: csv
 *         description: File format for the download
 *
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           example: 2024-01-01
 *         description: Filter records created from this date
 *
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           example: 2024-12-31
 *         description: Filter records created up to this date
 *
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           example: formal
 *         description: Optional dataset-specific filter (e.g. center type)
 *
 *     responses:
 *       200:
 *         description: File generated successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       400:
 *         description: Invalid dataset or format
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden (admin access only)
 *
 *       500:
 *         description: Internal server error
 */
AdminDownloadController.get(
  "/download-report",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const { dataset, format, ...filters } = req.query;

      const file = await AdminDownloadService.generate(
        dataset as string,
        format as string,
        filters,
      );

      res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
      res.setHeader("Content-Type", file.contentType);

      return res.send(file.buffer);
    } catch (err: any) {
      log.error(err.message);
      console.log(err);
      if (err instanceof HttpError) {
        return res
          .status(err.status)
          .json(ApiResponse(err.status, err.message));
      }

      return res.status(500).json(ApiResponse(500, "Internal server error"));
    }
  },
);
