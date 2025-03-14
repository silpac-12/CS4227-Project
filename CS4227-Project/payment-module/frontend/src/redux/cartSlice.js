import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedItem: null,
    orderId: null,
    paymentSuccess: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setSelectedItem: (state, action) => {
            console.log("🛒 Setting selected item:", action.payload);
            state.selectedItem = action.payload;
        },
        setOrderId: (state, action) => {
            console.log("📦 Order ID:", action.payload);
            state.orderId = action.payload;
        },
        setPaymentSuccess: (state, action) => {
            console.log("✅ Payment success:", action.payload);
            state.paymentSuccess = action.payload;
        },
        clearCart: (state) => {
            console.log("🗑️ Clearing cart...");
            state.selectedItem = null;
            state.orderId = null;
            state.paymentSuccess = false;
        },
    },
});

export const { setSelectedItem, setOrderId, setPaymentSuccess, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
