const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ["clothing", "grocery", "electronics", "others"] },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vendor: { type: String, required: true } // Ensure vendor field is included
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;