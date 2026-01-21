import { Router } from "express";
import { AdminEmailService } from "../services/admin-email.service";
import { verifyToken } from "../../../common/middleware/auth.middleware";
import { checkRole } from "../../../common/middleware/role.middleware";
import { ApiResponse } from "../../../common/responses/api-response";
import { HttpStatus } from "../../../common/enum/http-status.enum";
import { Logger } from "../../../common/logger/logger";
import { HttpError } from "../../../common/utils/HttpError";

const log = new Logger("AdminEmailController");
export const AdminEmailController = Router();

/**
 * @swagger
 * /api/admin/bulk-email:
 *   post:
 *     summary: Send bulk email to users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [audience, subject, html]
 *             properties:
 *               audience:
 *                 type: string
 *                 enum: [all, admins, collectors, centers]
 *               subject:
 *                 type: string
 *               html:
 *                 type: string
 *     responses:
 *       200:
 *         description: Emails sent successfully
 */

AdminEmailController.post(
  "/bulk-email",
  verifyToken,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const { audience, subject, html } = req.body;

      const result = await AdminEmailService.sendBulkEmail({
        audience,
        subject,
        html,
      });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Emails sent", result));
    } catch (err: any) {
      console.log(err);
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
