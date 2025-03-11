const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Create an order
router.post("/", async (req, res) => {
    const { user_email, total_amount, address } = req.body;

    if (!user_email || !total_amount || !address) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO orders (user_email, total_amount, address) VALUES (?, ?, ?)",
            [user_email, total_amount, address]
        );

        // ✅ Ensure we send the `orderId` properly
        res.json({ orderId: result.insertId });
    } catch (err) {
        console.error("Database Insert Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;


// Get an order by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
        if (order.length === 0) return res.status(404).json({ msg: "Order not found" });
        res.json(order[0]);
    } catch (err) {
        console.error("Order Retrieval Error:", err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
