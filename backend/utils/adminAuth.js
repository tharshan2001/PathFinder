const parseAdminEmails = () => {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const isAdminUser = (user) => {
  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  const adminEmails = parseAdminEmails();
  if (adminEmails.length === 0) {
    return false;
  }

  return adminEmails.includes(String(user.email || "").toLowerCase());
};
