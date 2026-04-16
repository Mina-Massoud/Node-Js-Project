import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const USER_FIELDS = "firstName lastName email";
const PRODUCT_FIELDS = "name price";
const MAX_LIMIT = 100;
const TERMINAL_STATUSES = ["delivered", "cancelled"];

const httpError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const clampPagination = (page, limit) => ({
  pageNum: Math.max(1, parseInt(page) || 1),
  limitNum: Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || 10)),
});

// Look up real prices server-side so clients can't tamper with them.
const buildItemsWithServerPrices = async (items) => {
  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      throw httpError(`Invalid product id: ${item.product}`, 400);
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw httpError("Each item must have a positive integer quantity", 400);
    }
  }

  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));

  return items.map((item) => {
    const id = item.product.toString();
    const price = priceMap.get(id);
    if (price == null) throw httpError(`Product ${item.product} not found`, 400);
    return { product: item.product, quantity: Number(item.quantity), price };
  });
};

const sumTotal = (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

// Atomic conditional decrement per product with rollback on partial failure.
// Safe on standalone MongoDB (no transactions needed).
const reserveStock = async (items) => {
  const reserved = [];
  try {
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (!updated) {
        const exists = await Product.findById(item.product).select("name stock");
        throw httpError(
          exists
            ? `Insufficient stock for "${exists.name}" (available: ${exists.stock}, requested: ${item.quantity})`
            : `Product ${item.product} not found`,
          400,
        );
      }
      reserved.push(item);
    }
  } catch (err) {
    await Promise.allSettled(
      reserved.map((r) =>
        Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } }),
      ),
    );
    throw err;
  }
};

const releaseStock = (items) =>
  Promise.all(
    items.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } }),
    ),
  );

// GET /orders — admin sees all, user sees own. Query: page, limit, status.
export const getOrders = async (req, res) => {
  const { page, limit, status } = req.query;
  const { pageNum, limitNum } = clampPagination(page, limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (req.user.role !== "admin") filter.user = req.user._id;
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", USER_FIELDS)
      .populate("items.product", PRODUCT_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    pages: Math.ceil(total / limitNum),
    data: orders,
  });
};

// GET /orders/:id — admin any, user own only.
export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", USER_FIELDS)
    .populate("items.product", PRODUCT_FIELDS);

  if (!order) throw httpError("Order not found", 404);

  if (
    req.user.role !== "admin" &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    throw httpError("Access denied: this order does not belong to you", 403);
  }

  res.status(200).json({ success: true, data: order });
};

// POST /orders — authenticated users.
export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw httpError("Order must contain at least one item", 400);
  }
  if (!shippingAddress) throw httpError("Shipping address is required", 400);

  const enrichedItems = await buildItemsWithServerPrices(items);

  await reserveStock(enrichedItems);

  try {
    const order = await Order.create({
      user: req.user._id,
      items: enrichedItems,
      totalPrice: sumTotal(enrichedItems),
      shippingAddress,
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    await releaseStock(enrichedItems);
    throw err;
  }
};

// PUT /orders/:id — admin only, full replacement.
export const updateOrder = async (req, res) => {
  const { items, shippingAddress, status } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw httpError("Order must contain at least one item", 400);
  }
  if (!shippingAddress) throw httpError("Shipping address is required", 400);
  if (!status) throw httpError("Status is required", 400);

  const existing = await Order.findById(req.params.id);
  if (!existing) throw httpError("Order not found", 404);
  if (TERMINAL_STATUSES.includes(existing.status)) {
    throw httpError(
      `Cannot update a ${existing.status} order`,
      400,
    );
  }

  const enrichedItems = await buildItemsWithServerPrices(items);

  // Release old stock, reserve new. If reservation fails, restore the original.
  await releaseStock(existing.items);
  try {
    await reserveStock(enrichedItems);
  } catch (err) {
    await reserveStock(existing.items).catch(() => {});
    throw err;
  }

  try {
    existing.items = enrichedItems;
    existing.shippingAddress = shippingAddress;
    existing.status = status;
    existing.totalPrice = sumTotal(enrichedItems);
    const order = await existing.save();

    // If admin moved it straight to cancelled, release the freshly-reserved stock.
    if (status === "cancelled") {
      await releaseStock(enrichedItems);
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    await releaseStock(enrichedItems).catch(() => {});
    throw err;
  }
};

// PATCH /orders/:id — admin only, status only.
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) throw httpError("Status field is required", 400);

  const order = await Order.findById(req.params.id);
  if (!order) throw httpError("Order not found", 404);

  if (
    TERMINAL_STATUSES.includes(order.status) &&
    status !== order.status
  ) {
    throw httpError(`Cannot change status of a ${order.status} order`, 400);
  }

  if (status === "cancelled" && order.status !== "cancelled") {
    await releaseStock(order.items);
  }

  order.status = status;
  await order.save();

  res.status(200).json({ success: true, data: order });
};

// DELETE /orders/:id — admin only.
export const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw httpError("Order not found", 404);

  if (!TERMINAL_STATUSES.includes(order.status)) {
    await releaseStock(order.items);
  }

  await order.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Order deleted successfully" });
};
