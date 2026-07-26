import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import { GOOGLE_CLIENT_ID, TEST_MODE } from "../utils/secrets";

let checkAuthTmp;

if (TEST_MODE) {
  checkAuthTmp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user = (await User.findOne({ username: "guest" })) ?? undefined;
      next();
    } catch (err) {
      next(err);
    }
  };
} else {
  // Fetches and caches Google's public keys on its own
  const googleClient = new OAuth2Client();

  checkAuthTmp = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.match(/^Bearer +(.+)$/i)?.[1];
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    let payload;
    try {
      // Verifies signature, `iss`, `aud` and `exp`
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!payload?.sub) return res.status(401).json({ error: "Invalid token" });

    try {
      let user = await User.findOne({ googleId: payload.sub });

      if (!user) {
        user = await User.create({
          googleId: payload.sub,
          username: payload.name,
          email: payload.email,
          registrationDate: new Date(),
        });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export const checkAuth = checkAuthTmp;
