import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Link } from "react-router-dom";
import { useCart } from "../store/cartContext";
import styles from "./Home.module.css";

const Home = () => {
    const { dispatch } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
        };
        loadProducts();
    }, []);

    const handleCheckout = (product) => {
        console.log("🛒 Setting selected item:", product);
        dispatch({ type: "SET_SELECTED_ITEM", payload: product });
    };

    return (
        <div className={styles.container}>
            <h1>Available Products</h1>
            <div className={styles.grid}>
                {products.length === 0 ? (
                    <p>Loading products...</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className={styles.product}>
                            <h3>{product.name}</h3>
                            <p>${product.price}</p>
                            <Link to="/checkout">
                                <button onClick={() => handleCheckout(product)}>Buy Now</button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
