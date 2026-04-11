import bcrypt from "bcryptjs";
import User from "../models/user/User.js";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export const ensureAdminUser = async () => {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

  if (!adminEmail || !adminPassword) {
    console.log("Admin bootstrap skipped: ADMIN_EMAIL or ADMIN_PASSWORD is not set.");
    return;
  }

  const existing = await User.findOne({ email: adminEmail });
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  if (!existing) {
    await User.create({
      name: "PathFinder Admin",
      email: adminEmail,
      password: passwordHash,
      role: "admin",
    });
    console.log(`Admin bootstrap created: ${adminEmail}`);
    return;
  }

  existing.role = "admin";
  existing.password = passwordHash;
  await existing.save();

  console.log(`Admin bootstrap updated: ${adminEmail}`);
};
