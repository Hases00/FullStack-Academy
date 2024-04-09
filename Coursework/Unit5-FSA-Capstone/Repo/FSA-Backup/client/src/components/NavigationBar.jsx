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

// import { Link } from "react-router-dom";

// const NavigationBar = ({ logout }) => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <Link className="navbar-brand" to="/">Home</Link>
//       <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//         <span className="navbar-toggler-icon"></span>
//       </button>
//       <div className="collapse navbar-collapse" id="navbarNav">
//         <ul className="navbar-nav">
//           <li className="nav-item">
//             <Link className="nav-link" to="/cart">Cart</Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/profile">Profile</Link>
//           </li>
//           <li className="nav-item">
//             <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default NavigationBar;
