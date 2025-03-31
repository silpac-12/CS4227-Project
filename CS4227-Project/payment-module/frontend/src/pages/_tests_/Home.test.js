import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Home from "../Home";
import * as api from "../../services/api";
import "@testing-library/jest-dom";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("../../services/api");

const renderWithProviders = (store) => {
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        </Provider>
    );
};

describe("Home Component", () => {
    const sampleProducts = [
        {
            id: 1,
            name: "Test Bike",
            description: "A fast bike",
            price: "199.99",
            image_url: "https://via.placeholder.com/150",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading message initially", async () => {
        api.fetchProducts.mockResolvedValueOnce([]);
        const store = mockStore({});
        renderWithProviders(store);

        expect(screen.getByText(/loading products/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(api.fetchProducts).toHaveBeenCalled();
        });
    });

    test("renders products after fetch", async () => {
        api.fetchProducts.mockResolvedValueOnce(sampleProducts);
        const store = mockStore({});
        renderWithProviders(store);

        await waitFor(() => {
            expect(screen.getByText(/test bike/i)).toBeInTheDocument();
            expect(screen.getByText(/a fast bike/i)).toBeInTheDocument();
            expect(screen.getByText(/\$199.99/)).toBeInTheDocument();
        });
    });

    test("dispatches selected product when 'Buy Now' is clicked", async () => {
        api.fetchProducts.mockResolvedValueOnce(sampleProducts);
        const store = mockStore({});
        renderWithProviders(store);

        await waitFor(() => {
            expect(screen.getByText(/buy now/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/buy now/i));

        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: "cart/setSelectedItem",
            payload: sampleProducts[0],
        });
    });
});
