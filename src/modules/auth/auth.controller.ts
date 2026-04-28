import { Router, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";
import { checkRole } from "../../common/middleware/role.middleware";

const log = new Logger("AuthController");
export const AuthController = Router();

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Initiates password reset flow
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset initiated
 */
AuthController.post("/forget-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await AuthServices.forgotPassword(email);

    return res.status(HttpStatus.OK).json(ApiResponse(HttpStatus.OK, result));
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
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
AuthController.post(
  "/logout",
  verifyToken,
  checkRole(["admin", "super_admin", "center", "collector"]),
  async (req: Request, res: Response) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse(HttpStatus.OK, "Logout successfull"));
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
 * /api/auth/confirm-password-reset:
 *   post:
 *     summary: Confirms password reset operation via OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset confirmed
 */
AuthController.post(
  "/confirm-password-reset",
  async (req: Request, res: Response) => {
    try {
      const { email, otp_code } = req.body;

      const result = await AuthServices.confirmPasswordReset(email, otp_code);

      return res.status(HttpStatus.OK).json(ApiResponse(HttpStatus.OK, result));
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
 * /api/auth/reset-password:
 *   post:
 *     summary: Resets user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp_code:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
AuthController.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, otp_code, password } = req.body;

    const result = await AuthServices.resetPassword(email, otp_code, password);

    return res.status(HttpStatus.OK).json(ApiResponse(HttpStatus.OK, result));
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
 * /api/auth/update-password:
 *   post:
 *     summary: Update user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               curPassword:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
AuthController.post(
  "/update-password",
  verifyToken,
  checkRole(["collector", "center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const { curPassword, role } = req.body;
    try {
      const result = await AuthServices.changePassword(
        user_id,
        curPassword,
        role,
      );
      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse(
            HttpStatus.OK,
            "Password update initiated. Check mail for OTP.",
            result,
          ),
        );
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

/**
 * @swagger
 * /api/auth/verify-password-update:
 *   put:
 *     summary: Verify password update
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully initiated password update
 */
AuthController.put(
  "/verify-password-update",
  verifyToken,
  checkRole(["collector", "center"]),
  async (req, res) => {
    const user_id = (req as any).user.sub;

    const { role, ...payload } = req.body;
    try {
      const result = await AuthServices.verifyPasswordUpdate(
        user_id,
        payload,
        role,
      );
      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse(HttpStatus.OK, "Password updated successfully.", result),
        );
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
