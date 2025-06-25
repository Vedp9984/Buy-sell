const express = require("express");
const bcrypt = require("bcrypt");
const Order = require("../models/orders");
const authMiddleware = require("../authMiddleware");

const router = express.Router();

// Place a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { transactionId, sellerId, amount } = req.body;
    const buyerId = req.user;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOrder = new Order({
      transactionId,
      buyerId,
      sellerId,
      amount,
      hashedOtp,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", otp, orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP and complete order
router.post("/verify-otp", authMiddleware, async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isMatch = await bcrypt.compare(otp, order.hashedOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    order.status = "Completed";
    await order.save();

    res.status(200).json({ message: "Order completed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




//history
router.get("/history",authMiddleware, async (req, res) => {
  // console.log('Inside /history', req.params.id);
  try {
    // console.log('Fetching order history for user:', req.user);
    const orders = await Order.find({ buyerId: req.user }).populate('itemId sellerId');
    // console.log('Fetched orders:', orders);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching order history:', err);
    res.status(500).json({ message: "hello Server error" });
  }
});



// Get order history for the buyer

// Get orders to be delivered by the seller
router.get("/deliver", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user, status: 'Pending' }).populate('itemId buyerId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders by a specific buyer
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders by a specific seller
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.params.sellerId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Complete order by verifying OTP
router.post("/complete/:orderId", authMiddleware, async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isMatch = await bcrypt.compare(otp, order.hashedOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    order.status = "Completed";
    await order.save();

    res.json({ message: "Order completed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific order by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'firstName lastName email')
      .populate('sellerId', 'firstName lastName email')
      .populate('itemId', 'name price');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Update an order by ID
router.put("/:id", async (req, res) => {
  try {
    const { buyerId, sellerId, amount, hashedOtp } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { buyerId, sellerId, amount, hashedOtp }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an order by ID
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;