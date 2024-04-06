// Cart Component
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Cart = ({ cart, updateCart, checkout, removeFromCart }) => {
  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.map((item, key) =>
        item.product ? (
          <div key={key}>
            <p>{item.product.name}</p>
            <p>Price: {item.product.price}</p>
            <button onClick={() => updateCart(item.id, item.quantity - 1)}>
              -
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => updateCart(item.id, item.quantity + 1)}>
              +
            </button>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ) : null
      )}
      <button onClick={checkout}>Checkout</button>
      <Link to="/">Return</Link>
    </div>
  );
};

Cart.propTypes = {
  auth: PropTypes.any,
  cart: PropTypes.array,
  checkout: PropTypes.any,
  removeFromCart: PropTypes.func,
  setCart: PropTypes.func,
  updateCart: PropTypes.func,
};

export default Cart;
