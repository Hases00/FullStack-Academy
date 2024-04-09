import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${id}`);
      const json = await response.json();
      setProduct(json);
    };

    fetchProduct();
  }, [id]);

  const submitReview = async () => {
    // Add your API endpoint to submit the review
    const response = await fetch(`/api/products/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify({ review }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Review submitted!");
      setReview("");
    } else {
      alert("Failed to submit review");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Quantity available: {product.quantity}</p>
      <button onClick={() => addToCart && addToCart(product.id)}>
        Add to Cart
      </button>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here"
      />
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
};

ProductDetails.propTypes = {
  addToCart: PropTypes.func,
};

export default ProductDetails;
