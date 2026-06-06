import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./auth";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (currentUser._id !== args.id) {
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

export const updateProfile = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(user._id, { name: args.name });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});

export const updateProfileImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    await ctx.db.patch(user._id, { image: imageUrl });
    return imageUrl;
  },
});
