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
    userId: v.string(),
    orderNumber: v.string(),
    orderItems: v.array(
      v.object({
        productId: v.optional(v.id("products")),
        name: v.string(),
        image: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    subtotal: v.number(),
    shipping: v.number(),
    discount: v.number(),
    total: v.number(),
    address: v.object({
      fullName: v.string(),
      mobile: v.string(),
      email: v.string(),
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      street: v.string(),
      country: v.string(),
      zipCode: v.string(),
    }),
    paymentMethod: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }),
});
