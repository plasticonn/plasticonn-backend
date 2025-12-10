import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.jwtSecret);
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
