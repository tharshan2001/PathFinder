const parseAdminEmails = () => {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || "";
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

  const admins = parseAdminEmails();
  if (admins.length === 0) {
    return false;
  }

  return admins.includes(String(user.email || "").toLowerCase());
};
