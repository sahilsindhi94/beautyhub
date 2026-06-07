import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";

const customPassword = Password({
  profile(params) {
    return {
      email: params.email,
      name: params.name,
      isActive: true,
      createdAt: Date.now(),
    };
  },
});

const originalAuthorize = customPassword.authorize;
customPassword.authorize = async (params, ctx) => {
  try {
    return await originalAuthorize(params, ctx);
  } catch (error) {
    if (
      error.message === "InvalidAccountId" ||
      error.message === "InvalidSecret" ||
      error.message === "Invalid credentials"
    ) {
      throw new ConvexError("Invalid email or password");
    }
    throw error;
  }
};

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [customPassword],
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
