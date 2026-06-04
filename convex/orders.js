import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireManagerOrAdmin } from "./auth";

const buildOrderNumber = (lastOrder) => {
  const year = new Date().getFullYear();
  const nextIndex = lastOrder
    ? Number(lastOrder.orderNumber.split("-").pop() || 0) + 1
    : 1;
  return `BH-${year}-${String(nextIndex).padStart(4, "0")}`;
};

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    let user = null;
    try {
      user = await getCurrentUser(ctx);
    } catch (error) {
      // Temporarily bypass auth check for Phase 6 behavior
    }

    if (user) {
      return await ctx.db
        .query("orders")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .order("desc")
        .collect();
    }

    // Fallback: return all orders for unauthenticated users
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    if (order.userId !== user._id && user.role !== "admin" && user.role !== "manager") {
      throw new Error("Unauthorized");
    }
    return order;
  },
});

export const createOrder = mutation({
  args: {
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
    let user = null;
    try {
      user = await getCurrentUser(ctx);
    } catch (error) {
      // Proceed as guest if not authenticated
    }

    const [lastOrder] = await ctx.db.query("orders").order("desc").take(1);
    const orderNumber = buildOrderNumber(lastOrder);

    const orderId = await ctx.db.insert("orders", {
      ...args,
      userId: user ? user._id : null,
      orderNumber,
    });

    return { orderId, orderNumber };
  },
});

export const listAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    requireManagerOrAdmin(user);
    return await ctx.db.query("orders").order("desc").collect();
  },
});
