import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { Role } from "@tavo/shared";

const router = Router();

if (config.googleClientId && config.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found from Google"), undefined);
          }

          // First user gets admin role automatically
          const userCount = await prisma.user.count();
          const roles = userCount === 0 ? ["admin", "reviewer"] : ["reviewer"];

          const user = await prisma.user.upsert({
            where: { email },
            update: {
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value || null,
              lastLogin: new Date(),
            },
            create: {
              id: profile.id, // using Google sub
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value || null,
              roles,
              isActive: true,
            },
          });

          if (!user.isActive) {
            return done(new Error("Account deactivated"), undefined);
          }

          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
}

router.get(
  "/google",
  authLimiter,
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  authLimiter,
  passport.authenticate("google", { session: false, failureRedirect: `${config.clientUrl}/login?error=auth_failed` }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(config.clientUrl);
  }
);

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user, token: req.cookies.token || "" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

export default router;
