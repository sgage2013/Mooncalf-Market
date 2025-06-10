import { Response } from "express";
import { check } from "express-validator";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Cart, CartItem, Item, Review, User } = db;

//get current user cart
router.get("/cart", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: Item,
          through: { attributes: ["quantity"] },
          attributes: [
            "id",
            "name",
            "price",
            [db.sequelize.fn("AVG", db.sequelize.col("items.reviews"))],
          ],
        },
      ],
    });
    if (!cart) {
      const newCart = await Cart.create({ userId: req.user.id });
      return res.json({ cart: newCart, items: [] });
    }
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Could not load cart" });
  }
});

//add items or increase quantity
router.post("/cart", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    if (!itemId || quantity <= 0) {
      return res.status(400).json({ message: "invalid itemId or quantity" });
    }

    let cart = await Cart.findOne({
      where: { userId: req.user.id },
    });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, itemId },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        itemId,
        quantity,
      });
    }
    return res.json(cartItem);
  } catch (error) {
    return res.status(500).json({ message: "Unable to add item to cart" });
  }
});

//update quantity of an item
router.put("/cart", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const { itemId, quantity } = req.body;
    if (!itemId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid itemId or quantity" });
    }
    const cart = await Cart.findOne({ where: { userid: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, itemId },
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.json(cartItem);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update cart" });
  }
});

// remove a cart item
router.delete(
  "/cart/:itemId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { itemId } = req.params;

      const cart = await Cart.findOne({ where: { userId: req.user.id } });
      if (!cart) {
        return res.status(404).json({ message: "Cannot find cart" });
      }
      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, itemId },
      });
      if (!cartItem) {
        return res.status(404).json({ message: "Cannot find item" });
      }

      await cartItem.destroy();
      return res
        .status(200)
        .json({ message: "Item successfully removed from cart " });
    } catch (error) {
      return res.status(500).json({ message: "Unable to remove item(s)" });
    }
  }
);

//clear cart after checkout
router.delete("/cart", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await db.CartItem.destroy({ where: { cartId: cart.id } });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to clear cart" });
  }
});

export = router;
