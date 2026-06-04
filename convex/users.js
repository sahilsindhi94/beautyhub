import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireAdmin } from "./auth";

export const syncCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    const email = identity.email ?? "";
    const name = identity.name ?? email.split("@")[0] ?? "BeautyHub Customer";
    const image = identity.pictureUrl;

    if (existing) {
      await ctx.db.patch(existing._id, {
        clerkId: identity.subject,
        name,
        email,
        image,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      tokenIdentifier: identity.tokenIdentifier,
      name,
      email,
      image,
      role: "customer",
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (currentUser._id !== args.id && currentUser.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return await ctx.db.get(args.id);
  },
});

export const getProfileStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    const wishlist = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    const cart = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return {
      totalOrders: orders.length,
      wishlistCount: wishlist.length,
      cartCount: cart.reduce((count, item) => count + item.quantity, 0),
    };
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    requireAdmin(user);
    return await ctx.db.query("users").collect();
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("customer")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    requireAdmin(user);
    await ctx.db.patch(args.userId, { role: args.role });
  },
});
