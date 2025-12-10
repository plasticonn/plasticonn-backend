import { Router, Request, Response } from "express";

export const AuthController = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/refresh-access:
 *   post:
 *     summary: Refreshes access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 */
AuthController.post("/refresh-access", (req: Request, res: Response) => {
  // your logic here
  res.json({ message: "Access token refreshed" });
});

/**
 * @swagger
 * /v1/api/auth/verify-account:
 *   post:
 *     summary: Verifies user account according to type via OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User account verified successfully
 */
AuthController.post("/verify-account", (req: Request, res: Response) => {
  res.json({ message: "Account verified" });
});

/**
 * @swagger
 * /v1/api/auth/send-verification-email:
 *   post:
 *     summary: Sends verification OTP via email
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
AuthController.post(
  "/send-verification-email",
  (req: Request, res: Response) => {
    res.json({ message: "Verification email sent" });
  }
);

/**
 * @swagger
 * /v1/api/auth/forget-password:
 *   post:
 *     summary: Initiates password reset flow
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset initiated
 */
AuthController.post("/forget-password", (req: Request, res: Response) => {
  res.json({ message: "Password reset initiated" });
});

/**
 * @swagger
 * /v1/api/auth/confirm-password-reset:
 *   post:
 *     summary: Confirms password reset operation via OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset confirmed
 */
AuthController.post(
  "/confirm-password-reset",
  (req: Request, res: Response) => {
    res.json({ message: "Password reset confirmed" });
  }
);

/**
 * @swagger
 * /v1/api/auth/reset-password:
 *   post:
 *     summary: Resets user password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
AuthController.post("/reset-password", (req: Request, res: Response) => {
  res.json({ message: "Password reset successfully" });
});

/**
 * @swagger
 * /v1/api/auth/update-password:
 *   post:
 *     summary: Updates user password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
AuthController.post("/update-password", (req: Request, res: Response) => {
  res.json({ message: "Password updated successfully" });
});
