import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
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
  }),

  categories: defineTable({
    name: v.string(),
    image: v.string(),
    slug: v.string(),
  }),

  wishlist: defineTable({
    userId: v.id("users"), // Assuming reference to users table
    productId: v.id("products"),
  }),

  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  }),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.optional(v.string()), // e.g., 'admin', 'customer'
    image: v.optional(v.string()),
  }),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    total: v.number(),
    status: v.string(), // e.g., 'pending', 'processing', 'shipped', 'delivered'
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    paymentMethod: v.string(), // e.g., 'card', 'paypal', 'cod'
  }),
});
