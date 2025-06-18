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
const router = require("express").Router();
const { Item, Cart, CartItem, Order, OrderItem } = models_1.default;
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
router.post("/checkout", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield Cart.findOne({
            where: { userId: req.user.id },
            include: [{ model: CartItem, include: [Item] }],
        });
        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const subTotal = cart.cartItems.reduce((sum, item) => sum + item.quantity * item.item.price, 0);
        const tax = parseFloat((subTotal * 0.07).toFixed(2));
        const shipping = 5.0;
        const orderTotal = subTotal + tax + shipping;
        const lineItems = cart.cartItems.map((cartItem) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: cartItem.item.name,
                },
                unit_amount: Math.round(cartItem.item.price * 100),
            },
            quantity: cartItem.quantity,
        }));
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            shipping_address_collection: {
                allowed_countries: ["US"],
            },
            billing_address_collection: "required",
            success_url: `${process.env.CLIENT_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            metadata: {
                userId: req.user.id.toString(),
                orderTotal,
            },
        });
        return res.status(200).json({ url: session.url });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Unable to create checkout session" });
    }
}));
router.get('/checkout/success/:orderId', auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield Order.findOne({
            where: { id: orderId, userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Item,
                            as: 'item',
                            attributes: ['id', 'name', 'mainImageUrl', 'price']
                        }
                    ]
                }
            ]
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.json({ order });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to load order' });
    }
}));
module.exports = router;
//# sourceMappingURL=checkout.js.map