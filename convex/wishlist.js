import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./auth";

export const getWishlist = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const items = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return await Promise.all(
      items.map(async (item) => ({
        ...item,
        product: await ctx.db.get(item.productId),
      }))
    );
  },
});

export const addToWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_userId_and_productId", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("wishlist", {
        userId: user._id,
        productId: args.productId,
      });
      return { status: "added" };
    }
    return { status: "exists" };
  },
});

export const removeFromWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_userId_and_productId", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { status: "removed" };
    }
    return { status: "missing" };
  },
});
