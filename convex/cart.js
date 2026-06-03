import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  args: { userId: v.string() }, // Fallback string for now
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const addToCart = mutation({
  args: { userId: v.string(), productId: v.id("products"), quantity: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { quantity: existing.quantity + args.quantity });
    } else {
      await ctx.db.insert("cart", {
        userId: args.userId,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

export const updateQuantity = mutation({
  args: { userId: v.string(), productId: v.id("products"), quantity: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();
      
    if (existing) {
      if (args.quantity <= 0) {
        await ctx.db.delete(existing._id);
      } else {
        await ctx.db.patch(existing._id, { quantity: args.quantity });
      }
    }
  },
});

export const removeFromCart = mutation({
  args: { userId: v.string(), productId: v.id("products") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();
      
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const clearCart = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
      
    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
  },
});
