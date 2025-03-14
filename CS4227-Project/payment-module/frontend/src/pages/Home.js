import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedItem } from "../redux/cartSlice";
import styles from "./Home.module.css";

const Home = () => {
    const dispatch = useDispatch();
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
        dispatch(setSelectedItem(product));
    };

    return (
        <div className={styles.container}>
            <h1>Available Products</h1>
            <div className={styles.productRow}>
                {products.length === 0 ? (
                    <p>Loading products...</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className={styles.productCard}>
                            <img src={product.image_url} alt={product.name} className={styles.productImage} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
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
