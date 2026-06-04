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
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"]),

  categories: defineTable({
    name: v.string(),
    image: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  wishlist: defineTable({
    userId: v.union(v.id("users"), v.string()),
    productId: v.id("products"),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_productId", ["userId", "productId"]),

  cart: defineTable({
    userId: v.union(v.id("users"), v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_productId", ["userId", "productId"]),

  users: defineTable({
    clerkId: v.string(),
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("customer")),
    isActive: v.boolean(),
    image: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  orders: defineTable({
    userId: v.optional(v.union(v.id("users"), v.string(), v.null())),
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
  }).index("by_userId", ["userId"]),
});
