import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const buildOrderNumber = (lastOrder) => {
  const year = new Date().getFullYear()
  const nextIndex = lastOrder
    ? Number(lastOrder.orderNumber.split('-').pop() || 0) + 1
    : 1
  return `BH-${year}-${String(nextIndex).padStart(4, '0')}`
}

export const getOrders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get("orders", args.orderId)
  },
});

export const createOrder = mutation({
  args: {
    userId: v.string(),
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
  },
  handler: async (ctx, args) => {
    const [lastOrder] = await ctx.db.query("orders").order("desc").take(1)
    const orderNumber = buildOrderNumber(lastOrder)

    const orderId = await ctx.db.insert("orders", {
      ...args,
      orderNumber,
    })

    return { orderId, orderNumber }
  },
});
