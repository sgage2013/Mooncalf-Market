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
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = require("../../utils/auth");
const models_1 = __importDefault(require("../../db/models"));
const uuid_1 = require("uuid");
const router = require("express").Router();
const { Item, Cart, CartItem, Order, OrderItem } = models_1.default;
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const generateOrderNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, uuid_1.v4)().slice(0, 8).toUpperCase();
});
const createOrderNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    let orderNumber = "";
    let isUnique = false;
    while (!isUnique) {
        orderNumber = yield generateOrderNumber();
        const existingOrder = yield Order.findOne({ where: { orderNumber } });
        if (!existingOrder) {
            isUnique = true;
        }
    }
    return orderNumber;
});
const cartTotals = (cartItems) => {
    const subTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.item.price, 0);
    const tax = parseFloat((subTotal * 0.07).toFixed(2));
    const shipping = 5.0;
    const orderTotal = subTotal + tax + shipping;
    return { subTotal, tax, shipping, orderTotal };
};
router.post("/create-payment-intent", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield Cart.findOne({
            where: { userId: req.user.id },
            include: [
                {
                    model: CartItem,
                    as: "cartItem",
                    include: [
                        {
                            model: Item,
                            as: "item",
                        },
                    ],
                },
            ],
        });
        if (!cart || cart.cartItem.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const { orderTotal } = cartTotals(cart.cartItem);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(orderTotal * 100),
            currency: "usd",
            metadata: {
                userId: req.user.id.toString(),
                orderTotal: orderTotal.toString(),
                cartId: cart.id.toString(),
            },
        });
        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Unable to create checkout session" });
    }
}));
router.post("/confirm-order", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentIntentId, address, city, state, zip } = req.body;
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (!address || !city || !state || !zip || zip.length < 5) {
            return res.status(400).json({ message: "Invalid address info" });
        }
        if (!paymentIntent) {
            return res.status(400).json({ message: "Payment not completed" });
        }
        const cart = yield Cart.findOne({
            where: { userId: req.user.id },
            include: [
                {
                    model: CartItem,
                    as: "cartItem",
                    include: [{ model: Item, as: "item" }],
                },
            ],
        });
        if (!cart || cart.cartItem.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const { subTotal, tax, shipping, orderTotal } = cartTotals(cart.cartItem);
        let newOrder = null;
        if (paymentIntent.status === "succeeded") {
            const orderNumber = yield createOrderNumber();
            newOrder = yield Order.create({
                userId: req.user.id,
                orderTotal,
                subTotal,
                tax,
                shipping,
                orderNumber,
                address,
                city,
                state,
                zip,
                stripePaymentIntentId: paymentIntent.id,
                status: "Pending",
            });
        }
        if (newOrder) {
            for (const cartItem of cart.cartItem) {
                yield OrderItem.create({
                    orderId: newOrder.id,
                    itemId: cartItem.item.id,
                    quantity: cartItem.quantity,
                    price: cartItem.item.price,
                });
            }
        }
        yield CartItem.destroy({ where: { cartId: cart.id } });
        const updateStatus = [
            "Pending",
            "Processing",
            "Confirmed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
        ];
        updateStatus.forEach((status, index) => {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const currentOrder = yield Order.findByPk(order.id);
                if (currentOrder && currentOrder.status !== "Cancelled") {
                    currentOrder.status = status;
                    yield currentOrder.save();
                }
            }), (index + 1) * 2 * 60 * 1000);
        });
        const order = yield Order.findOne({
            where: { id: newOrder.id },
            attributes: [
                "id",
                "orderNumber",
                "orderTotal",
                "status",
                "address",
                "city",
                "state",
                "zip",
            ],
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    attributes: ["itemId", "quantity", "price"],
                    include: [
                        {
                            model: Item,
                            as: "item",
                            attributes: ["id", "name", "mainImageUrl", "price"],
                        },
                    ],
                },
            ],
        });
        return res.status(200).json({
            message: "Order confirmed",
            success: true,
            order: order,
            orderNumber: newOrder ? newOrder.orderNumber : null,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to confirm order" });
    }
}));
router.get("/success/:orderId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield Order.findOne({
            where: { id: orderId, userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: Item,
                            as: "item",
                            attributes: ["id", "name", "mainImageUrl", "price"],
                        },
                    ],
                },
            ],
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const orderPreview = {
            id: order.id,
            orderNumber: order.orderNumber,
            orderTotal: parseFloat(order.orderTotal),
            status: order.status,
            shippingAddress: {
                address: order.address,
                city: order.city,
                state: order.state,
                zip: order.zip,
            },
            items: order.items.map((item) => ({
                itemId: item.itemId,
                name: item.item.name,
                mainImageUrl: item.item.mainImageUrl,
                price: parseFloat(item.price),
                quantity: item.quantity,
            })),
        };
        return res.json({ order: orderPreview });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to load order" });
    }
}));
module.exports = router;
//# sourceMappingURL=checkout.js.map