// TODO: Noura Ali — Order Controller
// - getOrders: admin sees all, regular user sees only own orders. Pagination (page/limit), filter by status. Populate user (name,email) and items.product (name,price). Sort by createdAt desc.
// - getOrder: find by ID, populate user+items.product. Ownership check: admin can view any, user can only view their own (403 otherwise).
// - createOrder: validate items non-empty + shippingAddress required. Calculate totalPrice = sum(item.price * item.quantity). Set user from req.user._id.
// - updateOrderStatus: admin only. Validate status field required. findByIdAndUpdate.
// - deleteOrder: admin only. findByIdAndDelete, 404 if not found.

import Order from "../models/Order.js";


// ========================
// GET /orders
// Admin → all orders | User → own orders
// Query: page, limit, status
// ========================
export const getOrders = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};
  if (req.user.role !== "admin") filter.user = req.user._id;
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: orders,
  });
};

// ========================
// GET /orders/:id
// Admin → any order | User → own order only
// ========================
export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "name price");

  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  if (
    req.user.role !== "admin" &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    const err = new Error("Access denied: this order does not belong to you");
    err.status = 403;
    throw err;
  }

  res.status(200).json({ success: true, data: order });
};

// ========================
// POST /orders
// Authenticated users
// ========================
export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    const err = new Error("Order must contain at least one item");
    err.status = 400;
    throw err;
  }

  if (!shippingAddress) {
    const err = new Error("Shipping address is required");
    err.status = 400;
    throw err;
  }

  const hasInvalidItem = items.some((item) => item.price == null || item.quantity == null);
  if (hasInvalidItem) {
    const err = new Error("Each item must have price and quantity");
    err.status = 400;
    throw err;
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    shippingAddress,
  });

  res.status(201).json({ success: true, data: order });
};

// ========================
// PUT /orders/:id
// Admin only — full order replacement
// ========================
export const updateOrder = async (req, res) => {
  const { items, shippingAddress, status } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    const err = new Error("Order must contain at least one item");
    err.status = 400;
    throw err;
  }

  if (!shippingAddress) {
    const err = new Error("Shipping address is required");
    err.status = 400;
    throw err;
  }

  if (!status) {
    const err = new Error("Status is required");
    err.status = 400;
    throw err;
  }

  const hasInvalidItem = items.some((item) => item.price == null || item.quantity == null);
  if (hasInvalidItem) {
    const err = new Error("Each item must have price and quantity");
    err.status = 400;
    throw err;
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { items, shippingAddress, status, totalPrice },
    { new: true, runValidators: true}
  );

  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true, data: order });
};

// ========================
// PATCH /orders/:id
// Admin only — partial update (status only)
// ========================
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    const err = new Error("Status field is required");
    err.status = 400;
    throw err;
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true, data: order });
};

// ========================
// DELETE /orders/:id
// Admin only
// ========================
export const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true, message: "Order deleted successfully" });
};
