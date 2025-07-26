// Buy.js
import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../product/ProductList";
import "../product/product-card.css";
import "./Buy.css";
import { BACKEND_BASE_URL } from "../../apiInstances/baseurl";


const Buy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_BASE_URL}/products/fetchProduct`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="buy-wrapper">
      <section className="search-hero block--dark">
        <div className="container">
          <header className="search-header" data-aos="fade-up">
            <h1 className="block__heading">
              Discover Amazing Products at{" "}
              <span className="text-highlight">Incredible Prices</span>
            </h1>
            <div className="search-container" data-aos="fade-up" data-aos-delay="200">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="books">Books & Media</option>
                <option value="other">Other</option>
              </select>
            </div>
          </header>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products-message">No products found.</div>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Buy;