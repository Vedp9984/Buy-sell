const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config();
const User = require('./models/users');
const Item = require('./models/items');
const Order = require('./models/orders');
const Cart = require('./models/cart');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json()); 
app.use(cors()); 

const authRoutes = require("./routes/log_reg");
const authMiddleware = require("./authMiddleware");
const itemRoutes = require("./routes/item");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const chatRoutes = require("./routes/chat"); // Add this line

app.use("/api/log_reg", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/chat", chatRoutes); // Add this line

app.get('/', (req, res) => {
  res.send('Welcome to Buy-Sell Portal API!');
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.user });
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

