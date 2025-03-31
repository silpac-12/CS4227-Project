// src/redux/__tests__/store.test.js

import { store } from "../store";
import {
    setSelectedItem,
    setOrderId,
    setPaymentSuccess,
    clearCart,
} from "../cartSlice";

describe("Redux Store", () => {
    it("should initialize with the correct default state", () => {
        const state = store.getState().cart;
        expect(state).toEqual({
            selectedItem: null,
            orderId: null,
            paymentSuccess: false,
        });
    });

    it("should update selectedItem when setSelectedItem is dispatched", () => {
        const item = { id: 1, name: "Test Product" };
        store.dispatch(setSelectedItem(item));
        const state = store.getState().cart;
        expect(state.selectedItem).toEqual(item);
    });

    it("should update orderId when setOrderId is dispatched", () => {
        store.dispatch(setOrderId(123));
        const state = store.getState().cart;
        expect(state.orderId).toBe(123);
    });

    it("should update paymentSuccess when setPaymentSuccess is dispatched", () => {
        store.dispatch(setPaymentSuccess(true));
        const state = store.getState().cart;
        expect(state.paymentSuccess).toBe(true);
    });

    it("should reset state when clearCart is dispatched", () => {
        store.dispatch(clearCart());
        const state = store.getState().cart;
        expect(state).toEqual({
            selectedItem: null,
            orderId: null,
            paymentSuccess: false,
        });
    });
});
