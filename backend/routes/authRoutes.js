

import express from "express";
import { register, login, logout, authMe } from "../controllers/user/authController.js";
import passport from "passport";
import { googleAuth, googleAuthCallback } from "../controllers/user/googleAuthController.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMe); 


// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), googleAuthCallback);

export default router;
