import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProductList = ({
  removeFavorite,
  addFavorite,
  addToCart,
  products,
  favorites,
  cartisLoading,
}) => {
  return (
    <div>
      <ul className="product-list">
        <div>Home, Slack</div>
        {products.map((product) => {
          const isFavorite = favorites.find(
            (favorite) => favorite.product_id === product.id
          );
          return (
            <li key={product.id} className={isFavorite ? "favorite" : ""}>
              <div className="product-details">
                <div className="product-div">
                  <p>Name: {product.name}</p>
                  <p>Price: ${product.price}</p>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-class"
                  />
                </div>
              </div>

              <div className="product-actions">
                {isFavorite ? (
                  <button onClick={() => removeFavorite(isFavorite.id)}>
                    Remove from Favorites
                  </button>
                ) : (
                  <button onClick={() => addFavorite(product.id)}>
                    Add to Favorites
                  </button>
                )}
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={cartisLoading}
                >
                  {" "}
                  {cartisLoading ? "Loading" : "Add to Cart"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <Link to="/cart">Cart</Link>
    </div>
  );
};

ProductList.propTypes = {
  addFavorite: PropTypes.func,
  addToCart: PropTypes.func,
  cartisLoading: PropTypes.bool,
  favorites: PropTypes.array,
  products: PropTypes.array,
  removeFavorite: PropTypes.func,
};

export default ProductList;
