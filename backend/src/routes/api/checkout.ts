import Stripe from "stripe";
import { Response } from "express";
import { validateUser } from "../../utils/auth";
import { ValidUser } from "../../typings/express";
import db from "../../db/models";
const router = require("express").Router();

const { Item, Cart, CartItem } = db;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

router.post(
  "/checkout",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const cart = await Cart.findOne({
        where: { userId: req.user.id },
        include: [{ model: CartItem, include: [Item] }],
      });
      if (!cart || cart.cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      const subTotal = cart.cartItems.reduce(
        (sum: number, item: any) => sum + item.quantity * item.item.price,
        0
      );
      const tax = parseFloat((subTotal * 0.07).toFixed(2));
      const shipping = 5.0;
      const orderTotal = subTotal + tax + shipping;

      const lineItems = cart.cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: cartItem.item.name,
          },
          unit_amount: Math.round(cartItem.item.price * 100),
        },
        quantity: cartItem.quantity,
      }));
      const session = await stripe.checkout.sessions.create({
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unable to create checkout session" });
    }
  }
);

export = router;
