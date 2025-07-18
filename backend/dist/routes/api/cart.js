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
const { Cart, CartItem, Item, Review } = models_1.default;
router.get("/", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                            attributes: ["id", "mainImageUrl", "name", "price"],
                        },
                    ],
                },
            ],
        });
        if (!cart) {
            const newCart = yield Cart.create({ userId: req.user.id });
            return res.json({
                cart: newCart,
                items: [],
                subTotal: 0,
                shipping: 0,
                tax: 0,
                orderTotal: 0,
            });
        }
        const formattedCartItems = yield Promise.all(cart.cartItem.map((cartItem) => __awaiter(void 0, void 0, void 0, function* () {
            const itemPrice = cartItem.item.price;
            const itemQuantity = cartItem.quantity;
            const itemReviews = yield Review.findAll({
                where: { itemId: cartItem.item.id },
                attributes: [
                    [models_1.default.sequelize.fn("AVG", models_1.default.sequelize.col("stars")), "avgRating"],
                ],
            });
            const avgRating = itemReviews.length > 0 && itemReviews[0].avgRating !== null
                ? parseFloat(itemReviews[0].avgRating)
                : 0;
            return {
                id: cartItem.id,
                itemId: cartItem.itemId,
                quantity: itemQuantity,
                item: {
                    id: cartItem.item.id,
                    name: cartItem.item.name,
                    mainImageUrl: cartItem.item.mainImageUrl,
                    price: itemPrice,
                    avgRating: avgRating,
                },
            };
        })));
        const subTotal = formattedCartItems.reduce((sum, cartItem) => {
            return sum + cartItem.quantity * cartItem.item.price;
        }, 0);
        const tax = parseFloat((subTotal * 0.07).toFixed(2));
        const shipping = 5.0;
        const orderTotal = parseFloat((subTotal + tax + shipping).toFixed(2));
        return res.json({
            cart: cart,
            items: formattedCartItems,
            subTotal,
            shipping,
            tax,
            orderTotal,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Could not load cart" });
    }
}));
router.post("/", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, quantity = 1 } = req.body;
        if (!itemId || quantity <= 0) {
            return res.status(400).json({ message: "invalid itemId or quantity" });
        }
        let cart = yield Cart.findOne({
            where: { userId: req.user.id },
        });
        if (!cart) {
            cart = yield Cart.create({ userId: req.user.id });
        }
        let cartItem = yield CartItem.findOne({
            where: { cartId: cart.id, itemId },
        });
        if (cartItem) {
            cartItem.quantity += quantity;
            yield cartItem.save();
        }
        else {
            cartItem = yield CartItem.create({
                cartId: cart.id,
                itemId,
                quantity,
            });
        }
        return res.json(cartItem);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to add item to cart" });
    }
}));
router.put("/", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, quantity } = req.body;
        if (!itemId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid itemId or quantity" });
        }
        const cart = yield Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const cartItem = yield CartItem.findOne({
            where: { cartId: cart.id, itemId },
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        cartItem.quantity = quantity;
        yield cartItem.save();
        return res.json(cartItem);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to update cart" });
    }
}));
router.delete("/:itemId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const cart = yield Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) {
            return res.status(404).json({ message: "Cannot find cart" });
        }
        const cartItem = yield CartItem.findOne({
            where: { cartId: cart.id, itemId },
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Cannot find item" });
        }
        yield cartItem.destroy();
        return res
            .status(200)
            .json({ message: "Item successfully removed from cart " });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to remove item(s)" });
    }
}));
router.delete("/", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        yield models_1.default.CartItem.destroy({ where: { cartId: cart.id } });
        return res.status(200).json({ message: "Cart cleared successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to clear cart" });
    }
}));
module.exports = router;
//# sourceMappingURL=cart.js.map