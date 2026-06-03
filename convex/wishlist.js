import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWishlist = query({
  args: { userId: v.string() }, // Fallback string for now
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wishlist")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const addToWishlist = mutation({
  args: { userId: v.string(), productId: v.id("products") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wishlist")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (!existing) {
      await ctx.db.insert("wishlist", {
        userId: args.userId,
        productId: args.productId,
      });
      return { status: "added" };
    }
    return { status: "exists" };
  },
});

export const removeFromWishlist = mutation({
  args: { userId: v.string(), productId: v.id("products") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wishlist")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { status: "removed" };
    }
  },
});
