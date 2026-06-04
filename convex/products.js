import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireManagerOrAdmin } from "./auth";

// Queries

export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .collect();
  },
});

export const getProductById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

export const searchProducts = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    const queryLower = args.searchQuery.toLowerCase();
    
    // Basic in-memory search for simplicity. 
    // In production, consider Convex Search index: https://docs.convex.dev/search
    return products.filter(
      (p) => 
        p.name.toLowerCase().includes(queryLower) || 
        p.brand.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower)
    );
  },
});

// Mutations

export const createProduct = mutation({
  args: {
    name: v.string(),
    brand: v.string(),
    category: v.string(),
    description: v.string(),
    image: v.string(),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    rating: v.number(),
    stock: v.number(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    requireManagerOrAdmin(user);
    const productId = await ctx.db.insert("products", args);
    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    brand: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
    oldPrice: v.optional(v.number()),
    rating: v.optional(v.number()),
    stock: v.optional(v.number()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    requireManagerOrAdmin(user);
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    requireManagerOrAdmin(user);
    await ctx.db.delete(args.id);
  },
});
