const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all products
router.get("/", async (req, res) => {
    try {
        const [products] = await pool.query("SELECT * FROM products");
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
