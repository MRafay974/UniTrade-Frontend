import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../product/ProductList";
import "./Sell.css";
import { useNavigate } from "react-router-dom";
import bannerImage from "../../assets/Images/banner.png";
import watchImage from "../../assets/Images/watch.jpeg";
import budsImage from "../../assets/Images/buds.jpg";

const Sell = () => {
  const [userProducts, setUserProducts] = useState([]);
  const navigate = useNavigate();
  const userId = "123"; // Replace with actual logged-in user ID

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products?sellerId=${userId}`
        );
        setUserProducts(response.data);
      } catch (error) {
        console.error("Error fetching user's products:", error);
      }
    };

    fetchUserProducts();
  }, [userId]);
  const sellerProducts = [
    {
      id: 1,
      name: "Ultra Sound Headphones",
      description:
        "High-quality over-ear headphones with noise cancellation and deep bass.",
      price: (Math.random() * (150 - 50) + 50).toFixed(2), // Random price between 50 and 150
      image: bannerImage,
    },
    {
      id: 2,
      name: "Smart Watch",
      description:
        "Smart fitness band with heart rate monitoring, sleep tracking, and water resistance.",
      price: (Math.random() * (200 - 100) + 100).toFixed(2), // Random price between 100 and 200
      image: watchImage,
    },
    {
      id: 3,
      name: "Pro Gamer Mouse",
      description:
        "Ergonomic gaming mouse designed for professional gamers with high DPI and customizable buttons.",
      price: (Math.random() * (80 - 30) + 30).toFixed(2), // Random price between 30 and 80
      image: budsImage,
    },
  ];
  return (
    <div className="sell-wrapper">
      <section className="seller-hero block--dark">
        <div className="container">
          <header className="seller-header" data-aos="fade-up">
            <h1 className="block__heading">
              Start Selling Today
              <span className="text-highlight">Turn Your Items into Profit</span>
            </h1>
            <p className="seller-tagline" data-aos="fade-up" data-aos-delay="200">
              Join thousands of successful sellers on our platform
            </p>
            <div className="stats-container" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-item">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Active Sellers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$1M+</span>
                <span className="stat-label">Monthly Sales</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </header>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">My Products</h2>
            <button
              onClick={() => navigate("/sell/add")}
              className="btn btn--ascent"
              data-aos="fade-left"
            >
              <span className="btn-icon">+</span>
              Add New Product
            </button>
          </div>
          <ProductList products={sellerProducts} />
        </div>
      </section>
    </div>
  );
};

export default Sell;
