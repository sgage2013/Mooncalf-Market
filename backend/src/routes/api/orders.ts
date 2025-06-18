import { Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Cart, CartItem, Item, Order, OrderItem } = db;

//get all orders
router.get("/orders", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const orders = await Order.findAll({
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
    const formatted = orders.map((order: any) => {
        const firstItem = order.items?.[0]?.item;
        return ({ 
            id: order.id,
            orderNumber : order.orderNumber,
            status: order.status,
            orderTotal: order.orderTotal,
            thumbnail: firstItem?.mainImageUrl || null,
            createdAt: order.createdAt
         });
    });
        return res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Unable to load orders" });
  }
});

//get a single order
router.get(
  "/orders/:orderId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findOne({
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
    } catch (error) {
      return res.status(500).json({ message: "Unable to load order" });
    }
  }
);

//create an oder from cart
router.post("/orders", validateUser, async (req: ValidUser, res: Response) => {
  try {
    const { address, city, state, zip } = req.body;
    if (!address || !city || !state || !zip || zip.length < 5) {
      return res.status(400).json({ message: "Invalid address info" });
    }
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [Item] }],
    });
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const orderTotal = cart.cartItems.reduce(
      (sum: number, items: any) => sum + items.quantity * items.item.price,
      0
    );
    const order = await Order.create({
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
      await OrderItem.create({
        orderId: order.id,
        itemId: cartItem.itemId,
        quantity: cartItem.quantity,
      });
    }
    await CartItem.destroy({ where: { cartId: cart.id } });

    const statusUpdates = [
      "Pending",
      "Processing",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    statusUpdates.forEach((status, index) => {
      setTimeout(async () => {
        const currentOrder = await Order.findByPk(order.id);
        if (currentOrder && currentOrder.status !== "Cancelled") {
          currentOrder.status = status;
          await currentOrder.save();
        }
      }, (index + 1) * 2 * 60 * 1000);
    });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create order" });
  }
});

//update order if status allows
router.put(
  "/orders/:orderId",
  validateUser,
  async (req: ValidUser, res: Response) => {
    const { orderId } = req.params;
    const { address, city, state, zip, items } = req.body;
    try{

    const order = await Order.findOne({
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
          const existingOrderItem = await OrderItem.findOne({
            where: {
              orderId: order.id,
              itemId: updatedItem.itemId,
            },
          });
          if (existingOrderItem) {
            if (updatedItem.quantity > 0) {
              existingOrderItem.quantity = updatedItem.quantity;
            } else {
              await existingOrderItem.destroy();
            }
          } else if (updatedItem.quantity > 0) {
            await OrderItem.create({
              orderId: order.id,
              itemId: updatedItem.itemId,
              quantity: updatedItem.quantity,
            });
          }
        }
        const updatedItems = await OrderItem.findAll({
          where: { orderId: order.id },
          include: [Item],
        });
        const newTotal = updatedItems.reduce((sum: number, orderItem: any) => {
          return sum + orderItem.quantity * orderItem.item.price;
        }, 0);
        order.orderTotal = newTotal;
      }
      await order.save();
      return res.status(200).json(order);
    }
} catch(error){
    return res.status(500).json({ message: 'Unable to update order'})
}
  }
);

//cancel an order
router.delete('/orders/:orderId', validateUser, async (req: ValidUser, res: Response) =>{
    const { orderId } = req.params;
    try{
        const order = await Order.findOne({
            where: {
                id: orderId,
                userId: req.user.id
            }
        });

        if(!order){
            return res.status(404).json({ message: 'Order not found'})
        }
        if(['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)){
            return res.status(403).json({ message: 'Order cannot be cancelled at this stage'})
        }
        order.status = 'Cancelled';
        await order.save();

        return res.status(200).json({ message: 'Order cancelled successfully'})
    } catch(error){
        return res.status(500).json({ message: 'Unable to cancel order'})
    }

});

export = router;