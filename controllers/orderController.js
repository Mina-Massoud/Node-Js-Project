// TODO: Noura Ali — Order Controller
// - getOrders: admin sees all, regular user sees only own orders. Pagination (page/limit), filter by status. Populate user (name,email) and items.product (name,price). Sort by createdAt desc.
// - getOrder: find by ID, populate user+items.product. Ownership check: admin can view any, user can only view their own (403 otherwise).
// - createOrder: validate items non-empty + shippingAddress required. Calculate totalPrice = sum(item.price * item.quantity). Set user from req.user._id.
// - updateOrderStatus: admin only. Validate status field required. findByIdAndUpdate.
// - deleteOrder: admin only. findByIdAndDelete, 404 if not found.
