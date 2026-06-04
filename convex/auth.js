import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email,
          name: params.name,
          isActive: true,
          createdAt: Date.now(),
        };
      },
    }),
  ],
});

export async function getCurrentUser(ctx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db.get(userId);

  if (!user || !user.isActive) {
    throw new Error("Unauthorized");
  }

  return user;
}

export function isAdmin() {
  return false;
}

export function isManager() {
  return false;
}

export function isCustomer() {
  return true;
}

export function requireAdmin() {
  throw new Error("Unauthorized");
}

export function requireManagerOrAdmin() {
  throw new Error("Unauthorized");
}
