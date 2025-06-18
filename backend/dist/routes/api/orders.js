"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const auth_1 = require("../../utils/auth");
const models_1 = __importDefault(require("../../db/models"));
const router = require("express").Router();
const { Cart, CartItem, Item, Order, OrderItem } = models_1.default;
router.get("/orders", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    include: [{
                            model: Item,
                            attributes: ['id', 'mainImageUrl']
                        }],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        const formatted = orders.map((order) => {
            var _a, _b;
            const firstItem = (_b = (_a = order.items) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.item;
            return ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                orderTotal: order.orderTotal,
                thumbnail: (firstItem === null || firstItem === void 0 ? void 0 : firstItem.mainImageUrl) || null,
                createdAt: order.createdAt
            });
        });
        return res.status(200).json(formatted);
    }
    catch (error) {
        res.status(500).json({ message: "Unable to load orders" });
    }
}));
router.get("/orders/:orderId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield Order.findOne({
            where: { id: orderId, userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    include: [{ model: Item }],
                },
            ],
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.json(order);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to load order" });
    }
}));
router.post("/orders", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, city, state, zip } = req.body;
        if (!address || !city || !state || !zip || zip.length < 5) {
            return res.status(400).json({ message: "Invalid address info" });
        }
        const cart = yield Cart.findOne({
            where: { userId: req.user.id },
            include: [{ model: CartItem, include: [Item] }],
        });
        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const orderTotal = cart.cartItems.reduce((sum, items) => sum + items.quantity * items.item.price, 0);
        const order = yield Order.create({
            userId: req.user.id,
            status: "Pending",
            orderTotal,
            orderNumber: Math.floor(Math.random() * 1000000),
            address,
            city,
            state,
            zip,
        });
        for (const cartItem of cart.cartItems) {
            yield OrderItem.create({
                orderId: order.id,
                itemId: cartItem.itemId,
                quantity: cartItem.quantity,
            });
        }
        yield CartItem.destroy({ where: { cartId: cart.id } });
        const statusUpdates = [
            "Pending",
            "Processing",
            "Confirmed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
        ];
        statusUpdates.forEach((status, index) => {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const currentOrder = yield Order.findByPk(order.id);
                if (currentOrder && currentOrder.status !== "Cancelled") {
                    currentOrder.status = status;
                    yield currentOrder.save();
                }
            }), (index + 1) * 2 * 60 * 1000);
        });
        return res.status(200).json(order);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to create order" });
    }
}));
router.put("/orders/:orderId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { address, city, state, zip, items } = req.body;
    try {
        const order = yield Order.findOne({
            where: { id: orderId, userId: req.user.id },
            include: [{ model: OrderItem }],
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (!["Pending", "Processing"].includes(order.status)) {
            return res
                .status(403)
                .json({ message: "Order cannot be updated at this stage" });
        }
        if (address) {
            if (!address.trim()) {
                return res.status(400).json({ message: "Address is required" });
            }
            order.address = address;
            if (zip) {
                if (!zip.trim()) {
                    return res.status(400).json({ message: "Zip code is required" });
                }
                order.zip = zip;
            }
            if (city) {
                if (!city.trim()) {
                    return res.status(400).json({ message: "City is required" });
                }
                order.city = city;
            }
            if (state) {
                if (!state.trim()) {
                    return res.status(400).json({ message: "State is required" });
                }
                order.state = state;
            }
            if (Array.isArray(items) && items.length > 0) {
                for (const updatedItem of items) {
                    const existingOrderItem = yield OrderItem.findOne({
                        where: {
                            orderId: order.id,
                            itemId: updatedItem.itemId,
                        },
                    });
                    if (existingOrderItem) {
                        if (updatedItem.quantity > 0) {
                            existingOrderItem.quantity = updatedItem.quantity;
                        }
                        else {
                            yield existingOrderItem.destroy();
                        }
                    }
                    else if (updatedItem.quantity > 0) {
                        yield OrderItem.create({
                            orderId: order.id,
                            itemId: updatedItem.itemId,
                            quantity: updatedItem.quantity,
                        });
                    }
                }
                const updatedItems = yield OrderItem.findAll({
                    where: { orderId: order.id },
                    include: [Item],
                });
                const newTotal = updatedItems.reduce((sum, orderItem) => {
                    return sum + orderItem.quantity * orderItem.item.price;
                }, 0);
                order.orderTotal = newTotal;
            }
            yield order.save();
            return res.status(200).json(order);
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to update order' });
    }
}));
router.delete('/orders/:orderId', auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const order = yield Order.findOne({
            where: {
                id: orderId,
                userId: req.user.id
            }
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)) {
            return res.status(403).json({ message: 'Order cannot be cancelled at this stage' });
        }
        order.status = 'Cancelled';
        yield order.save();
        return res.status(200).json({ message: 'Order cancelled successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to cancel order' });
    }
}));
module.exports = router;
//# sourceMappingURL=orders.js.map