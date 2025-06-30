import Stripe from "stripe";
import { Response } from "express";
import { validateUser } from "../../utils/auth";
import { ValidUser } from "../../typings/express";
import db from "../../db/models";
import { v4 as uuidv4 } from "uuid";
const router = require("express").Router();

const { Item, Cart, CartItem, Order, OrderItem } = db;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

//middleware

const generateOrderNumber = async () => {
  return uuidv4().slice(0, 8).toUpperCase();
};

const createOrderNumber = async () => {
  let orderNumber: string = "";
  let isUnique = false;
  while (!isUnique) {
    orderNumber = await generateOrderNumber();
    const existingOrder = await Order.findOne({ where: { orderNumber } });
    if (!existingOrder) {
      isUnique = true;
    }
  }
  return orderNumber;
};

const cartTotals = (cartItems: any[]) => {
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.item.price,
    0
  );
  const tax = parseFloat((subTotal * 0.07).toFixed(2));
  const shipping = 5.0;
  const orderTotal = subTotal + tax + shipping;

  return { subTotal, tax, shipping, orderTotal };
};

//routes

router.post(
  "/create-payment-intent",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const cart = await Cart.findOne({
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
      const paymentIntent = await stripe.paymentIntents.create({
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unable to create checkout session" });
    }
  }
);

router.post(
  "/confirm-order",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { paymentIntentId } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment not completed" });
      }
      const cart = await Cart.findOne({
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
      let newOrder: any = null;
      if (paymentIntent.status === "succeeded") {
        const orderNumber = await createOrderNumber();
        newOrder = await Order.create({
          userId: req.user.id,
          orderTotal: orderTotal,
          subTotal: subTotal,
          tax: tax,
          shipping: shipping,
          orderNumber: orderNumber,
          stripePaymentIntentId: paymentIntent.id,
          status: "completed",
        });
      }

      if (newOrder) {
        for (const cartItem of cart.cartItem) {
          await OrderItem.create({
            orderId: newOrder.id,
            itemId: cartItem.item.id,
            quantity: cartItem.quantity,
            price: cartItem.item.price,
          });
        }
      }
      await CartItem.destroy({ where: { cartId: cart.id } });

      const order = await Order.findOne({
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
            as: "orderItems",
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Unable to confirm order" });
    }
  }
);

router.get(
  "/success/:orderId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { orderId } = req.params;

      const order = await Order.findOne({
        where: { id: orderId, userId: req.user.id },
        include: [
          {
            model: OrderItem,
            as: "orderItems",
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
      return res.json({ order });
    } catch (error) {
      return res.status(500).json({ message: "Unable to load order" });
    }
  }
);

export = router;
