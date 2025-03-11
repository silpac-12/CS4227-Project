import axios from "axios";

const API_URL = "http://localhost:5000/api";  // Change this when deploying

export const createOrder = async (orderData) => {
    try {
        const response = await axios.post("http://localhost:5000/api/orders", orderData, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("API Order Response:", response.data);  // ✅ Log API response
        return response.data;  // ✅ Return response properly
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};



export const processPayment = async (paymentData) => {
    return await axios.post(`${API_URL}/payments`, paymentData, {
        headers: { "Content-Type": "application/json" }
    });
};

export const fetchProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};