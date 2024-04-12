import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = ({
  addToCart,
  addFavorite,
  removeFavorite,
  fetchProduct,
}) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      const product = await fetchProduct(id);
      setProduct(product);
    };

    getProduct();
  }, [id, fetchProduct]);

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
      <button onClick={() => addFavorite && addFavorite(product.id)}>
        Add to Favorites
      </button>
      <button onClick={() => removeFavorite && removeFavorite(product.id)}>
        Remove from Favorites
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
  addFavorite: PropTypes.func,
  addToCart: PropTypes.func,
  fetchProduct: PropTypes.func,
  removeFavorite: PropTypes.func,
};

export default ProductDetails;
