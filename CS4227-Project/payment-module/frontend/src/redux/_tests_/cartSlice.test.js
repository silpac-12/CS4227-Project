import cartReducer, {
    setSelectedItem,
    setOrderId,
    setPaymentSuccess,
    clearCart,
} from "../cartSlice";

describe("cartSlice", () => {
    const initialState = {
        selectedItem: null,
        orderId: null,
        paymentSuccess: false,
    };

    it("should return the initial state", () => {
        expect(cartReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
    });

    it("should handle setSelectedItem", () => {
        const item = { id: 1, name: "Test Bike", price: "199.99" };
        const nextState = cartReducer(initialState, setSelectedItem(item));
        expect(nextState.selectedItem).toEqual(item);
    });

    it("should handle setOrderId", () => {
        const nextState = cartReducer(initialState, setOrderId(123));
        expect(nextState.orderId).toBe(123);
    });

    it("should handle setPaymentSuccess", () => {
        const nextState = cartReducer(initialState, setPaymentSuccess(true));
        expect(nextState.paymentSuccess).toBe(true);
    });

    it("should handle clearCart", () => {
        const filledState = {
            selectedItem: { id: 2, name: "Helmet" },
            orderId: 456,
            paymentSuccess: true,
        };
        const nextState = cartReducer(filledState, clearCart());
        expect(nextState).toEqual(initialState);
    });
});
