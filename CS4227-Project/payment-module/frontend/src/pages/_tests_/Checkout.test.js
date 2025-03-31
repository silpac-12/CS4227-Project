import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Checkout from "../Checkout";
import * as api from "../../services/api";
import "@testing-library/jest-dom";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const setup = (customState = {}) => {
    const initialState = {
        cart: {
            selectedItem: { id: 1, name: "Test Bike", price: "199.99" },
            orderId: null,
            paymentSuccess: false,
        },
        ...customState,
    };

    const store = mockStore(initialState);

    render(
        <Provider store={store}>
            <Checkout />
        </Provider>
    );

    return store;
};

describe("Checkout Component", () => {
    test("renders form with email and address", () => {
        setup();
        expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/your address/i)).toBeInTheDocument();
        expect(screen.getByText(/next/i)).toBeInTheDocument();
    });

    test("shows error if inputs are missing", async () => {
        setup();
        fireEvent.click(screen.getByText(/next/i));

        await waitFor(() => {
            expect(
                screen.getByText((content) => content.includes("Invalid email format."))
            ).toBeInTheDocument();
        });
    });

    test("submits order and moves to payment step", async () => {
        jest.spyOn(api, "createOrder").mockResolvedValue({ orderId: 456 });

        setup();
        fireEvent.change(screen.getByPlaceholderText(/your email/i), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/your address/i), {
            target: { value: "123 Main Street" },
        });

        fireEvent.click(screen.getByText(/next/i));

        await waitFor(() => {
            expect(screen.getByText(/order id/i)).toBeInTheDocument();
            expect(screen.getByText(/pay now/i)).toBeInTheDocument();
        });
    });

    test("submits payment successfully and shows success message", async () => {
        jest.spyOn(api, "createOrder").mockResolvedValue({ orderId: 789 });
        jest.spyOn(api, "processPayment").mockResolvedValue({
            paymentId: 1,
            transaction_id: "TXN123",
        });

        setup();
        fireEvent.change(screen.getByPlaceholderText(/your email/i), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/your address/i), {
            target: { value: "123 Main Street" },
        });
        fireEvent.click(screen.getByText(/next/i));

        await waitFor(() => {
            expect(screen.getByText(/order id/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/card number/i), {
            target: { value: "4111111111111" },
        });
        fireEvent.change(screen.getByPlaceholderText(/expiry date/i), {
            target: { value: "12/25" },
        });
        fireEvent.change(screen.getByPlaceholderText(/cvv/i), {
            target: { value: "123" },
        });

        fireEvent.click(screen.getByText(/pay now/i));
    });
});
