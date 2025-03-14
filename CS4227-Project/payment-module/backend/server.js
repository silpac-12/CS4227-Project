const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

const app = express();


app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

// Register Routes
const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);

const paymentRoutes = require("./routes/payments");
app.use("/api/payments", paymentRoutes);

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

// Database Test Route
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1+1 AS result");
        res.json({ success: true, result: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Connection Failed");
    }
});

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
