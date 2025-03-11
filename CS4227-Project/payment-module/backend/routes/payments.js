const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Simulate payment processing
router.post("/", async (req, res) => {
    const { order_id, payment_method } = req.body;

    if (!order_id || !payment_method) {
        return res.status(400).json({ error: "Order ID and payment method are required" });
    }

    const transaction_id = "TXN" + Date.now(); // Fake transaction ID

    try {
        const [result] = await pool.query(
            "INSERT INTO payments (order_id, payment_method, payment_status, transaction_id) VALUES (?, ?, 'Success', ?)",
            [order_id, payment_method, transaction_id]
        );

        // Update order status to "Paid"
        await pool.query("UPDATE orders SET status = 'Paid' WHERE id = ?", [order_id]);

        res.json({ paymentId: result.insertId, transaction_id });
    } catch (err) {
        console.error("Payment Processing Error:", err);
        res.status(500).send("Server Error");
    }
});

// Get Payment by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [payment] = await pool.query("SELECT * FROM payments WHERE id = ?", [id]);
        if (payment.length === 0) return res.status(404).json({ msg: "Payment not found" });
        res.json(payment[0]);
    } catch (err) {
        console.error("Payment Retrieval Error:", err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
