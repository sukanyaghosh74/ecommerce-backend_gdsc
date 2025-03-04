const express = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const Product = require("../models/Product");

const router = express.Router();

// Add a product (Seller only)
router.post("/", authenticate, authorize("seller"), async (req, res) => {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({ name, description, price, stock, sellerId: req.user.id });
    res.json(product);
});

// Get all products
router.get("/", async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});

module.exports = router;
