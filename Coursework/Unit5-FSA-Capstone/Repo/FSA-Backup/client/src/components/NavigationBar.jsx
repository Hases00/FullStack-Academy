import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/profile">Profile</Link>
      {/* Add more links as needed */}
    </nav>
  );
};

export default NavigationBar;
