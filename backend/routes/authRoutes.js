import express from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { register, login, logout, getMe } from "../controllers/user/authController.js";
import passport from "passport";
import User from "../models/user/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5080/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "",
            profileMedia: { avatar: profile.photos[0]?.value }
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleAuthCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  
  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.redirect(`http://localhost:5173/auth/google/callback?token=${token}`);
};

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);
router.get("/google", googleAuth);
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), googleAuthCallback);

export default router;
