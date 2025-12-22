export function sanitizeUserForClient(user) {
  return {
    email: user.email,
    name: user.name ?? "",
    phone: user.phone ?? "",
    country: user.country ?? "",
    username: user.username,
    avatar: user.avatar ?? null,
  };
}
