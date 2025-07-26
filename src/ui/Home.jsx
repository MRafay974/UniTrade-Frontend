import "./Home.css";
import bannerImage from "../assets/Images/banner.png";

const Home = () => {
  return (
    <div className="home-wrapper">
      <section className="block block--dark hero">
        <div className="container grid grid--1x2">
          <header className="block__header hero__content">
            <h1 className="block__heading" data-aos="fade-right">
              Buy & Sell Products at 
              <span className="text-highlight">Unbeatable Prices</span>
            </h1>
            <p className="hero__tagline" data-aos="fade-up" data-aos-delay="200">
              Transform your unused items into opportunities. 
              Join our community of smart buyers and sellers today!
            </p>
            <div className="stats-container" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99%</span>
                <span className="stat-label">Happy Customers</span>
              </div>
            </div>
            <div className="hero__actions" data-aos="fade-up" data-aos-delay="400">
              <a href="/buy" className="btn btn--ascent btn--stretched">
                Browse Products
              </a>
              <a href="/sell/add" className="btn btn--outline btn--stretched">
                Start Selling
              </a>
            </div>
          </header>
          <div className="hero__image-wrapper" data-aos="zoom-out-up">
            <div className="floating-cards">
              <div className="card card-1">
                <span className="card-icon">🛒</span>
                <span className="card-text">Easy Shopping</span>
              </div>
              <div className="card card-2">
                <span className="card-icon">💎</span>
                <span className="card-text">Best Deals</span>
              </div>
            </div>
            <img
              className="hero__image"
              src={bannerImage}
              alt="Hero Banner"
              loading="eager"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
