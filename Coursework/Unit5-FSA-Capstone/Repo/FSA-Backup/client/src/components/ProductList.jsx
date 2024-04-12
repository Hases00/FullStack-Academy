import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";

const ProductList = ({
  removeFavorite,
  removeFromCart,
  addFavorite,
  addToCart,
  products,
  favorites,
  cartisLoading,
  cart,
  auth,
}) => {
  const [sortKey, setSortKey] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const isAddedtoCart = (product_id) => {
    return !!cart.find((item) => item.product_id === product_id);
  };

  let sortedProducts = [...products];
  if (sortKey) {
    sortedProducts.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
  }

  let filteredProducts = [...sortedProducts];
  if (filterKey && filterValue) {
    if (filterKey === "price") {
      filteredProducts = filteredProducts.filter(
        (product) => product[filterKey] <= filterValue
      );
    } else {
      filteredProducts = filteredProducts.filter(
        (product) => product[filterKey] === filterValue
      );
    }
  }

  return (
    <div>
      <h1>Products</h1>
      <div>
        <label>Sort by: </label>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="">--Select--</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div>
        <label>Filter by: </label>
        <select
          value={filterKey}
          onChange={(e) => setFilterKey(e.target.value)}
        >
          <option value="">--Select--</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          {/* Add more options as needed */}
        </select>
        {filterKey === "price" ? (
          <input
            type="range"
            min="0"
            max="1000" // Adjust this value based on your maximum price
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        ) : (
          <input
            type="text"
            placeholder="Filter Value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        )}
      </div>
      <ul className="product-list">
        {filteredProducts.map((product) => {
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
              {auth.id && (
                <div className="product-actions">
                  {isFavorite ? (
                    <button
                      onClick={() =>
                        removeFavorite && removeFavorite(isFavorite.id)
                      }
                    >
                      Remove from Favorites
                    </button>
                  ) : (
                    <button
                      onClick={() => addFavorite && addFavorite(product.id)}
                    >
                      Add to Favorites
                    </button>
                  )}
                  {isAddedtoCart(product.id) ? (
                    <button onClick={() => removeFromCart(product.id)}>
                      Remover
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart && addToCart(product.id)}
                      disabled={cartisLoading}
                    >
                      {" "}
                      {cartisLoading ? "Loading" : "Add to Cart"}
                    </button>
                  )}

                  <Link to={`/product/${product.id}`}>View Details</Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ProductList.propTypes = {
  addFavorite: PropTypes.func,
  addToCart: PropTypes.func,
  auth: PropTypes.shape({
    id: PropTypes.any,
  }),
  cart: PropTypes.array,
  cartisLoading: PropTypes.bool,
  favorites: PropTypes.array,
  products: PropTypes.array,
  removeFavorite: PropTypes.func,
  removeFromCart: PropTypes.func,
};

export default ProductList;

// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

// const ProductList = ({
//   removeFavorite,
//   addFavorite,
//   addToCart,
//   products,
//   favorites,
//   cartisLoading,
// }) => {
//   return (
//     <div className="row"> {/* Replace product-list class with Bootstrap row class */}
//       <div className="col-12">Home, Slack</div>
//       {products.map((product) => {
//         const isFavorite = favorites.find(
//           (favorite) => favorite.product_id === product.id
//         );
//         return (
//           <div key={product.id} className={`col-12 col-md-6 col-lg-4 ${isFavorite ? "favorite" : ""}`}> {/* Replace li elements with Bootstrap col classes */}
//             <div className="card"> {/* Add Bootstrap card class */}
//               <div className="card-body">
//                 <h5 className="card-title">{product.name}</h5>
//                 <p className="card-text">Price: ${product.price}</p>
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="img-fluid" {/* Replace img-class class with Bootstrap img-fluid class */}
//                 />
//               </div>
//               <div className="card-footer">
//                 {isFavorite ? (
//                   <button className="btn btn-primary" onClick={() => removeFavorite(isFavorite.id)}> {/* Add Bootstrap btn and btn-primary classes */}
//                     Remove from Favorites
//                   </button>
//                 ) : (
//                   <button className="btn btn-primary" onClick={() => addFavorite(product.id)}> {/* Add Bootstrap btn and btn-primary classes */}
//                     Add to Favorites
//                   </button>
//                 )}
//                 <button
//                   className="btn btn-primary" {/* Add Bootstrap btn and btn-primary classes */}
//                   onClick={() => addToCart && addToCart(product.id)}
//                   disabled={cartisLoading}
//                 >
//                   {" "}
//                   {cartisLoading ? "Loading" : "Add to Cart"}
//                 </button>
//                 <Link to={`/product/${product.id}`}>View Details</Link>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//       <Link className="col-12" to="/cart">Cart</Link>
//     </div>
//   );
// };
// export default ProductList;
