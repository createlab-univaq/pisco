import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { SERVICE_TOKEN } from "../utils/secrets";

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

/**
 * Server-to-server auth for trusted internal callers -- currently game-api,
 * which needs the flow catalogue for the analyst dashboard but has no Google
 * identity to present.
 *
 * The token is a shared secret, so this must never guard an endpoint a browser
 * talks to directly.
 */
export const checkServiceToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const provided = req.headers["x-service-token"];

  if (
    !SERVICE_TOKEN ||
    typeof provided !== "string" ||
    !safeEqual(provided, SERVICE_TOKEN)
  ) {
    return res.status(401).json({ error: "Invalid service token" });
  }

  next();
};
