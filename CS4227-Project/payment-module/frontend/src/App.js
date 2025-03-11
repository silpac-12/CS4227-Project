import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./store/cartContext";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";

const App = () => {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </Router>
        </CartProvider>
    );
};

export default App;
