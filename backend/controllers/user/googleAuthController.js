import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/user/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // ✅ ENV-BASED CALLBACK URL (NO LOCALHOST)
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          email: profile.emails[0].value
        });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "", // Google users don't use password
            profileMedia: {
              avatar: profile.photos[0]?.value
            }
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

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"]
});

export const googleAuthCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ Secure cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // ✅ Redirect to FRONTEND (NO LOCALHOST)
  res.redirect(
    `${process.env.CLIENT_URL}/auth/google/callback?token=${token}`
  );
};