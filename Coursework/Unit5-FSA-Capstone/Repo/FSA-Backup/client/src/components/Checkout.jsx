import PropTypes from "prop-types";

const Checkout = ({ orders }) => {
  return (
    <div>
      <h2>Thank you for your purchase!</h2>
      {orders.map((order, index) => (
        <div key={index}>
          <h3>Order {index + 1}</h3>
          {order.items.map((item, i) => (
            <p key={i}>
              {item.product.name}: ${item.product.price} x {item.quantity}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

Checkout.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default Checkout;
