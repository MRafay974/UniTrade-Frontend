import React, { useState } from 'react';
import './Browse.css';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  // Mock data - replace with actual API calls
  const products = [
    {
      id: 1,
      title: "Smartphone",
      price: 499.99,
      category: "electronics",
      image: "https://placeholder.com/300",
      rating: 4.5,
      seller: "TechStore"
    },
    // Add more mock products here
  ];

  return (
    <div className="browse-container">
      <section className="search-section">
        <div className="search-wrapper">
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
            <option value="sports">Sports</option>
          </select>
        </div>
      </section>

      <section className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" data-aos="fade-up">
            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-details">
              <h3>{product.title}</h3>
              <div className="price-rating">
                <span className="price">${product.price}</span>
                <span className="rating">⭐ {product.rating}</span>
              </div>
              <p className="seller">Seller: {product.seller}</p>
              <button className="btn btn--primary">View Details</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Browse;