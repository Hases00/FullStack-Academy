import PropTypes from "prop-types";

const Orders = ({ orders }) => {
  return (
    <div className="orders">
      <h2>Orders</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          {/* <p>Total: {order.total}</p> */}
        </div>
      ))}
    </div>
  );
};

Orders.propTypes = {
  orders: PropTypes.array,
};

export default Orders;
