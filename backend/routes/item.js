const express = require("express");
const Item = require("../models/items");
const authMiddleware = require("../authMiddleware");
const router = express.Router();
const User = require("../models/users");

// Add a new item
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const sellerId = req.user;

    // Fetch the user to get the vendor name
    const user = await User.findById(sellerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vendor = `${user.firstName} ${user.lastName}`;

    console.log('Received data:', { name, price, description, category, sellerId, vendor });

    const newItem = new Item({ name, price, description, category, sellerId, vendor });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error saving item:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('sellerId', 'firstName lastName email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an item by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const item = await Item.findByIdAndUpdate(req.params.id, { name, price, description, category }, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an item by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Ensure that only the vendor can delete the item
    if (item.sellerId.toString() !== req.user) {
      return res.status(403).json({ message: "You are not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;