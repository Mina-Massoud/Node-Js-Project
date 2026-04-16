import Order from "../models/Order.js";
import Product from "../models/Product.js";

const USER_FIELDS = "firstName lastName email";
const PRODUCT_FIELDS = "name price";

const httpError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Look up real prices server-side so clients can't tamper with them.
const buildItemsWithServerPrices = async (items) => {
  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));

  return items.map((item) => {
    const id = item.product?.toString();
    const price = priceMap.get(id);
    if (price == null) throw httpError(`Product ${item.product} not found`, 400);
    if (!item.quantity || item.quantity < 1) {
      throw httpError("Each item must have a positive quantity", 400);
    }
    return { product: item.product, quantity: item.quantity, price };
  });
};

const sumTotal = (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

// GET /orders — admin sees all, user sees own. Query: page, limit, status.
export const getOrders = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};
  if (req.user.role !== "admin") filter.user = req.user._id;
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", USER_FIELDS)
      .populate("items.product", PRODUCT_FIELDS)
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

  const order = await Order.create({
    user: req.user._id,
    items: enrichedItems,
    totalPrice: sumTotal(enrichedItems),
    shippingAddress,
  });

  res.status(201).json({ success: true, data: order });
};

// PUT /orders/:id — admin only, full replacement.
export const updateOrder = async (req, res) => {
  const { items, shippingAddress, status } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw httpError("Order must contain at least one item", 400);
  }
  if (!shippingAddress) throw httpError("Shipping address is required", 400);
  if (!status) throw httpError("Status is required", 400);

  const enrichedItems = await buildItemsWithServerPrices(items);

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      items: enrichedItems,
      shippingAddress,
      status,
      totalPrice: sumTotal(enrichedItems),
    },
    { new: true, runValidators: true }
  );

  if (!order) throw httpError("Order not found", 404);

  res.status(200).json({ success: true, data: order });
};

// PATCH /orders/:id — admin only, status only.
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) throw httpError("Status field is required", 400);

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) throw httpError("Order not found", 404);

  res.status(200).json({ success: true, data: order });
};

// DELETE /orders/:id — admin only.
export const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw httpError("Order not found", 404);

  res
    .status(200)
    .json({ success: true, message: "Order deleted successfully" });
};
