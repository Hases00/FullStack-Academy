// Cart Component
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";

const Cart = ({ cart, updateCart, checkout, removeFromCart }) => {
  const history = useHistory();

  const handleCheckout = async () => {
    await checkout();
    history.push("/checkout");
  };
  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.map((item, key) =>
        item ? (
          <div key={key}>
            <p>{item.name}</p>
            <p>Price: {item.price}</p>

            <button
              disabled={item.quantity === 1}
              onClick={() =>
                updateCart({
                  product_id: item.product_id,
                  quantity: item.quantity - 1,
                })
              }
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() =>
                updateCart({
                  product_id: item.product_id,
                  quantity: item.quantity + 1,
                })
              }
            >
              +
            </button>
            <button onClick={() => removeFromCart(item.product_id)}>
              Remove
            </button>
          </div>
        ) : null
      )}
      <button onClick={handleCheckout}>Checkout</button>
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
