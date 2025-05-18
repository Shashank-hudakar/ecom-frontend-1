import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Calculate delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBackClick = () => {
    navigate("/products");
  };

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, Number(e.target.value)));
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
        });
      }
      alert("Added to cart!");
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist({
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      alert("Added to wishlist!");
    }
  };

  // Simulate user registration/login check
  const isUserLoggedIn = () => {
    return !!localStorage.getItem('user');
  };

  const handleBuyNow = () => {
    if (!isUserLoggedIn()) {
      alert("Please log in to continue your purchase.");
      navigate("/login", { state: { from: `/product/${id}` } });
    } else {
      // Add the product to cart first
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
        });
      }
      // Then navigate to checkout
      navigate("/checkout");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      {/* Back to Shop Button */}
      <div style={{ margin: '2rem 0 0 0', textAlign: 'left' }}>
        <button className="buy-btn" onClick={handleBackClick}>← Back to Shop</button>
      </div>
      <div className="product-details-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-details-img"
        />
        <div className="product-details-info">
          <div className="product-details-title">{product.title}</div>
          <div className="product-details-price">${product.price}</div>
          <div className="product-details-rating">
            ⭐ {product.rating?.rate || "N/A"} ({product.rating?.count || 0} reviews)
          </div>
          <div className="product-details-desc">{product.description}</div>
          
          {/* Delivery Information */}
          <div className="delivery-info">
            <h3>Delivery Information</h3>
            <div className="delivery-item">
              <span className="delivery-icon">🚚</span>
              <span>Estimated Delivery: {formattedDeliveryDate}</span>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">💳</span>
              <span>Cash on Delivery Available</span>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">🔄</span>
              <span>7 Days Replacement Policy</span>
            </div>
          </div>

          <div className="product-details-qty">
            <label htmlFor="qty">Quantity:</label>
            <input
              id="qty"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <button className="buy-btn" style={{ marginRight: '1rem' }} onClick={handleAddToCart}>Add to Cart</button>
          <button className="buy-btn" style={{ background: '#fff', color: '#3a0ca3', border: '1px solid #3a0ca3', marginRight: '1rem' }} onClick={handleAddToWishlist}>Add to Wishlist</button>
          <button className="buy-btn" style={{ background: '#2b9348', color: '#fff', marginTop: '1rem' }} onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="product-reviews">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="overall-rating">
            <div className="rating-number">{product.rating?.rate || "N/A"}</div>
            <div className="rating-stars">{"⭐".repeat(Math.round(product.rating?.rate || 0))}</div>
            <div className="rating-count">{product.rating?.count || 0} reviews</div>
          </div>
        </div>
        
        {/* Sample Reviews - In a real app, these would come from an API */}
        <div className="reviews-list">
          <div className="review-item">
            <div className="review-header">
              <div className="reviewer-name">John Doe</div>
              <div className="review-rating">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="review-date">March 15, 2024</div>
            <div className="review-text">
              "Great product! The quality is excellent and it arrived earlier than expected. Highly recommended!"
            </div>
          </div>
          <div className="review-item">
            <div className="review-header">
              <div className="reviewer-name">Jane Smith</div>
              <div className="review-rating">⭐⭐⭐⭐</div>
            </div>
            <div className="review-date">March 10, 2024</div>
            <div className="review-text">
              "Good product overall. The only reason for 4 stars is that the delivery took a bit longer than expected."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
