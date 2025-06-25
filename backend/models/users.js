const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-zA-Z0-9\.\_\%\+\-]+@(students|research)?\.iiit\.ac\.in$/, // Only IIIT emails
  },
  age: { type: Number, required: true, min: 18 },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  cart: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number, default: 1 },
    },
  ],
  sellerReviews: [
    {
      reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      review: String,
    },
  ],
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;