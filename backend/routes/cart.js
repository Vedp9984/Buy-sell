const express = require("express");
const Cart = require("../models/cart");
const Order = require("../models/orders");
const Item = require("../models/items");
const authMiddleware = require("../authMiddleware");
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const router = express.Router();

// Add item to cart
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ itemId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete("/:itemId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.itemId.toString() !== itemId);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// View cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const cart = await Cart.findOne({ userId }).populate("items.itemId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post('/order', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user }).populate('items.itemId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orders = [];
    for (const cartItem of cart.items) {
      if (cartItem.itemId.sellerId.toString() === req.user) {
        return res.status(400).json({ message: 'You cannot buy your own item' });
      }

      const otp = crypto.randomBytes(3).toString('hex');
      const hashedOtp = await bcrypt.hash(otp, 10);
      const transactionId = crypto.randomBytes(16).toString('hex'); // Generate a random transaction ID
      const order = new Order({
        transactionId,
        buyerId: req.user,
        sellerId: cartItem.itemId.sellerId,
        itemId: cartItem.itemId._id,
        quantity: cartItem.quantity,
        hashedOtp,
        status: 'Pending'
      });
      await order.save();
      orders.push({ ...order.toObject(), otp });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Order placed successfully', orders });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;