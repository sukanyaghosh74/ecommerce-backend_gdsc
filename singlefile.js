require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 1️⃣ Database Connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false
});

// 📌 2️⃣ Define Models
const User = sequelize.define("User", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("buyer", "seller"), allowNull: false }
});

const Product = sequelize.define("Product", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    sellerId: { type: DataTypes.UUID, allowNull: false }
});

const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

const Order = sequelize.define("Order", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "completed"), defaultValue: "pending" }
});

// 📌 3️⃣ Middleware for Authentication & Authorization
const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
        next();
    };
};

// 📌 4️⃣ User Authentication
app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
});

// 📌 5️⃣ Product Management (Seller Only)
app.post("/products", authenticate, authorize("seller"), async (req, res) => {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({ name, description, price, stock, sellerId: req.user.id });
    res.json(product);
});

app.get("/products", async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});

// 📌 6️⃣ Shopping Cart
app.post("/cart", authenticate, async (req, res) => {
    const { productId, quantity } = req.body;
    const cartItem = await Cart.create({ userId: req.user.id, productId, quantity });
    res.json(cartItem);
});

app.get("/cart", authenticate, async (req, res) => {
    const cartItems = await Cart.findAll({ where: { userId: req.user.id } });
    res.json(cartItems);
});

// 📌 7️⃣ Checkout & Orders
app.post("/checkout", authenticate, async (req, res) => {
    const cartItems = await Cart.findAll({ where: { userId: req.user.id } });
    if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

    const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * 100, 0);
    await Order.create({ userId: req.user.id, totalAmount, status: "pending" });
    await Cart.destroy({ where: { userId: req.user.id } });

    res.json({ message: "Order placed successfully", totalAmount });
});

// 📌 8️⃣ Webhook for Cart Updates (Bonus Feature)
app.post("/webhook/cart-update", async (req, res) => {
    console.log("📢 Cart updated: ", req.body);
    res.status(200).send("Webhook received");
});

// 📌 9️⃣ Start Server & Sync Database
sequelize.sync().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log("🚀 Server running on port", process.env.PORT || 5000);
    });
});
