import { Router, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { ApiResponse } from "../../common/responses/api-response";
import { HttpStatus } from "../../common/enum/http-status.enum";
import { Logger } from "../../common/logger/logger";
import { HttpError } from "../../common/utils/HttpError";
import { verifyToken } from "../../common/middleware/auth.middleware";

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
  }
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

// /**
//  * @swagger
//  * /api/auth/update-password:
//  *   post:
//  *     summary: Updates user password
//  *     tags: [Auth]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               oldPassword:
//  *                 type: string
//  *               newPassword:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Password updated successfully
//  */
// AuthController.post(
//   "/update-password",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     try {
//       const user_id = (req as any).user.id;
//       const { oldPassword, newPassword } = req.body;

//       const result = await AuthServices.resetPassword(
//         user_id,
//         oldPassword,
//         newPassword
//       );

//       return res.status(HttpStatus.OK).json(ApiResponse(HttpStatus.OK, result));
//     } catch (err: any) {
//       log.error(err.message);

//       if (err instanceof HttpError) {
//         return res
//           .status(err.status)
//           .json(ApiResponse(err.status, err.message));
//       }

//       return res.status(500).json(ApiResponse(500, "Internal server error"));
//     }
//   }
// );
