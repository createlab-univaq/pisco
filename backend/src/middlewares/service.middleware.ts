import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { APP_SERVICE_TOKEN } from "../utils/secrets";

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

  // Distinguish "not configured here" from "caller sent the wrong value":
  // both reject, but they need entirely different fixes.
  if (!APP_SERVICE_TOKEN) {
    console.error(
      "APP_SERVICE_TOKEN is not set: rejecting every service-to-service request",
    );
    return res.status(503).json({ error: "Service auth not configured" });
  }

  if (typeof provided !== "string" || !safeEqual(provided, APP_SERVICE_TOKEN)) {
    console.error(
      `Rejected service token (received ${
        typeof provided === "string" ? `${provided.length} chars` : "no header"
      }, expected ${APP_SERVICE_TOKEN.length})`,
    );
    return res.status(401).json({ error: "Invalid service token" });
  }

  next();
};
