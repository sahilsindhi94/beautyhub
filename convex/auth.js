export async function getCurrentUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();

  if (!user || !user.isActive) {
    throw new Error("Unauthorized");
  }

  return user;
}

export function isAdmin(user) {
  return user?.role === "admin";
}

export function isManager(user) {
  return user?.role === "manager";
}

export function isCustomer(user) {
  return user?.role === "customer";
}

export function requireAdmin(user) {
  if (!isAdmin(user)) {
    throw new Error("Unauthorized");
  }
}

export function requireManagerOrAdmin(user) {
  if (!isAdmin(user) && !isManager(user)) {
    throw new Error("Unauthorized");
  }
}
