import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createUser = mutation({
  args: { name: v.string(), email: v.string(), role: v.optional(v.string()), image: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});
