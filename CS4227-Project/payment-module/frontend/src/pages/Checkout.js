import { useState, useEffect } from "react";
import { useCart } from "../store/cartContext";
import { createOrder, processPayment } from "../services/api";
import styles from "./Checkout.module.css";

const Checkout = () => {
    const { state, dispatch } = useCart();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    console.log("State:", state);

    // Ensure `selectedItem` exists
    const selectedItem = state.selectedItem || (!paymentSuccess ? null : { name: "Your Order", price: orderId ? 0 : null });

    useEffect(() => {
        if (!selectedItem) {
            console.log("No item selected! Redirecting...");
        } else {
            console.log("Selected Item:", selectedItem);
        }
    }, [selectedItem]);

    useEffect(() => {
        
    }, [step]);

    if (!selectedItem) {
        return <h2>No item selected. Go back to the homepage.</h2>;
    }

    const itemPrice = parseFloat(selectedItem.price) || 0;

    //Step 1: Create Order
    const handleAddressSubmit = async () => {
        if (!email || !address) {
            setError("Please enter your email and address.");
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

            console.log("Order Data:", orderData);
            const response = await createOrder(orderData);

            if (!response || !response.orderId) {
                throw new Error("Invalid response from server");
            }
            setOrderId(response.orderId)

            dispatch({
                type: "SET_PAYMENT",
                payload: { orderId: response.orderId },
            });

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
            console.log("Payment Error: No orderId found in state", state.payment);
            console.log("id: ", orderId)
            return;
        }

        if (!cardNumber || !expiry || !cvv) {
            setError("Please enter all card details.");
            return;
        }

        setLoading(true);
        setError(null);
        console.log("Processing payment...");

        try {
            const paymentData = {
                order_id: orderId,
                payment_method: "Card",
            };

            const response = await processPayment(paymentData);
            console.log("Payment Response:", response);

            dispatch({ type: "CLEAR_CART" });
            setPaymentSuccess(true);
            setStep(3);
        } catch (err) {
            console.error("Payment failed:", err);
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
                    <h3>Item: {selectedItem.name}</h3>
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
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Expiry Date (MM/YY)"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
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
