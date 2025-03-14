import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrderId, setPaymentSuccess, clearCart } from "../redux/cartSlice";
import { createOrder, processPayment } from "../services/api";
import styles from "./Checkout.module.css";

const Checkout = () => {
    const dispatch = useDispatch();
    const selectedItem = useSelector((state) => state.cart.selectedItem);
    const orderId = useSelector((state) => state.cart.orderId);
    const paymentSuccess = useSelector((state) => state.cart.paymentSuccess);

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("🔍 Redux State:", { selectedItem, orderId, paymentSuccess });

    if (!selectedItem && !paymentSuccess) {
        return <h2>No item selected. Go back to the homepage.</h2>;
    }

    const itemPrice = parseFloat(selectedItem?.price) || 0;

    // ✅ Validate Email Format
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // ✅ Validate Expiry Date (MM/YY format)
    const validateExpiry = (expiry) => {
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
    };

    // ✅ Validate CVV (3-4 digits)
    const validateCVV = (cvv) => {
        return /^\d{3,4}$/.test(cvv);
    };

    // ✅ Validate Card Number (Only Numbers, 13-16 Digits)
    const validateCardNumber = (card) => {
        return /^\d{13,16}$/.test(card);
    };

    // ✅ Step 1: Create Order
    const handleAddressSubmit = async () => {
        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }

        if (!address) {
            setError("Address cannot be empty.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderData = {
                user_email: email,
                total_amount: itemPrice,
                address,
            };

            console.log("📦 Order Data:", orderData);
            const response = await createOrder(orderData);

            if (!response || !response.orderId) {
                throw new Error("Invalid response from server");
            }

            dispatch(setOrderId(response.orderId));
            setStep(2);
        } catch (err) {
            setError("Order creation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Step 2: Process Payment
    const handlePayment = async () => {
        if (!orderId) {
            setError("No order found. Please go back and create an order.");
            return;
        }

        if (!validateCardNumber(cardNumber)) {
            setError("Invalid card number. Must be 13-16 digits.");
            return;
        }

        if (!validateExpiry(expiry)) {
            setError("Invalid expiry date format. Use MM/YY.");
            return;
        }

        if (!validateCVV(cvv)) {
            setError("Invalid CVV. Must be 3 or 4 digits.");
            return;
        }

        setLoading(true);
        setError(null);
        console.log("✅ Processing payment...");

        try {
            const paymentData = {
                order_id: orderId,
                payment_method: "Card",
            };

            const response = await processPayment(paymentData);
            console.log("✅ Payment Response:", response);

            dispatch(clearCart());
            dispatch(setPaymentSuccess(true));
            setStep(3);
        } catch (err) {
            console.error("❌ Payment failed:", err);
            setError("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Checkout</h1>
            {error && <p className={styles.error}>{error}</p>}

            {/* Step 1: Enter Address */}
            {step === 1 && (
                <>
                    <h3>Item: {selectedItem?.name}</h3>
                    <p>Price: ${itemPrice.toFixed(2)}</p>

                    <h3>Enter Your Details</h3>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Your Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button className={styles.button} onClick={handleAddressSubmit} disabled={loading}>
                        {loading ? "Processing..." : "Next"}
                    </button>
                </>
            )}

            {/* Step 2: Payment Form */}
            {step === 2 && (
                <>
                    <h3>Enter Payment Details</h3>
                    <p>Order ID: {orderId}</p>
                    <p>Total Amount: ${itemPrice.toFixed(2)}</p>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Card Number (13-16 digits)"
                        value={cardNumber}
                        maxLength="16"
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Expiry Date (MM/YY)"
                        value={expiry}
                        maxLength="5"
                        onChange={(e) => setExpiry(e.target.value.replace(/[^0-9/]/g, ""))} // Enforce MM/YY
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="CVV (3-4 digits)"
                        value={cvv}
                        maxLength="4"
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                    />
                    <button className={styles.button} onClick={handlePayment} disabled={loading}>
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </>
            )}

            {/* Step 3: Order Success */}
            {step === 3 && <h3>✅ Order Successful! Thank you for your purchase.</h3>}
        </div>
    );
};

export default Checkout;
