import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./index.css";

// Login component
const Login = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = (ev) => {
    ev.preventDefault();
    login({ username, password });
  };
  return (
    <form onSubmit={submitLogin}>
      <input
        value={username}
        placeholder="username"
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        value={password}
        placeholder="password"
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button disabled={!username || !password}>Login</button>
    </form>
  );
};

Login.propTypes = {
  login: PropTypes.func,
};
// Register Component
const Register = ({ register }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitRegister = async (ev) => {
    ev.preventDefault();
    try {
      await register({ username, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submitRegister}>
      <input
        value={username}
        placeholder="username"
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        value={password}
        placeholder="password"
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button disabled={!username || !password}>Register</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

Register.propTypes = {
  register: PropTypes.func,
};
// Cart Component
const Cart = ({
  cart,
  auth,
  setCart,
  updateCart,
  checkout,
  removeFromCart,
}) => {
  // Fetch cart items when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await fetch(`/api/users/${auth.id}/cart`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      }
    };

    fetchCartItems();
  }, [auth.id, setCart]);

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.map((item) =>
        item.product ? (
          <div key={item.id}>
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
    </div>
  );
};

Cart.propTypes = {
  cart: PropTypes.array,
  auth: PropTypes.object.isRequired,
  setCart: PropTypes.func.isRequired,
  updateCart: PropTypes.func,
  checkout: PropTypes.func,
  removeFromCart: PropTypes.func,
};
// Order component
const Orders = ({ orders }) => {
  return (
    <div className="orders">
      <h2>Orders</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          <p>Total: {order.total}</p>
        </div>
      ))}
    </div>
  );
};

Orders.propTypes = {
  orders: PropTypes.array,
};

function App() {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setAuth(json);
      } else {
        window.localStorage.removeItem("token");
      }
    }
  };
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();
      setProducts(json);
    };

    fetchProducts();
  }, []);
  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetch(`/api/users/${auth.id}/favorites`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setFavorites(json);
      }
    };
    if (auth.id) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [auth]);
  // Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch(`/api/users/${auth.id}/cart`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      }
    };
    if (auth.id) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [auth]);
  // Fetch Order
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`/api/users/${auth.id}/orders`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setOrders(json);
      }
    };
    if (auth.id) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [auth]);

  //New AutoForm

  const AuthForm = ({ action }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submitForm = async (ev) => {
      ev.preventDefault();
      try {
        await action({ username, password });
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <form onSubmit={submitForm}>
        <input
          value={username}
          placeholder="username"
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          value={password}
          placeholder="password"
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button disabled={!username || !password}>
          {action === login ? "Login" : "Register"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    );
  };

  AuthForm.propTypes = {
    action: PropTypes.func,
  };

  // Internal Functions To Routes
  // Login
  const login = async (credentials) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
      attemptLoginWithToken();
    } else {
      console.log(json);
      const error = await response.json();
      throw new Error(error.message);
    }
  };

  const addFavorite = async (product_id) => {
    const response = await fetch(`/api/users/${auth.id}/favorites`, {
      method: "POST",
      body: JSON.stringify({ product_id }),
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (response.ok) {
      setFavorites([...favorites, json]);
    } else {
      console.log(json);
    }
  };

  const removeFavorite = async (id) => {
    const response = await fetch(`/api/users/${auth.id}/favorites/${id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      setFavorites(favorites.filter((favorite) => favorite.id !== id));
    } else {
      console.log();
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
  };

  const register = async (credentials) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
    } else {
      console.log(json);
    }
  };
  // New Functions Cart and Checkout

  const addToCart = async (product_id) => {
    const response = await fetch(`/api/users/${auth.id}/cart`, {
      method: "POST",
      body: JSON.stringify({ user_id: auth.id, product_id, quantity: 1 }), // add user_id and quantity
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (response.ok) {
      setCart([...cart, json]);
    } else {
      console.log(json);
    }
  };

  // const addToCart = async (product_id) => {
  //   // Check if the product is already in the cart
  //   const item = cart.find((item) => item.product.id === product_id);

  //   if (item) {
  //     // If the product is already in the cart, update the quantity
  //     await updateCart(item.id, item.quantity + 1);
  //   } else {
  //     // If the product is not in the cart, add it
  //     const response = await fetch(`/api/users/${auth.id}/cart`, {
  //       method: "POST",
  //       body: JSON.stringify({ user_id: auth.id, product_id, quantity: 1 }),
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: window.localStorage.getItem("token"),
  //       },
  //     });

  //     const json = await response.json();
  //     if (response.ok) {
  //       setCart([...cart, json]);
  //     } else {
  //       console.log(json);
  //     }
  //   }
  // };

  const removeFromCart = async (id) => {
    // Optimistically update the cart state
    setCart(cart.filter((item) => item.id !== id));

    // Then, send the network request to remove the cart item from the server
    const response = await fetch(`/api/users/${auth.id}/cart/${id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });

    // If the network request fails, revert the cart state
    if (!response.ok) {
      console.error(`Failed to remove cart item with id ${id}`);
      setCart(cart); // Revert the cart state
    }
  };

  const updateCart = async (id, quantity) => {
    // Optimistically update the cart state
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    // Then, send the network request to update the cart item on the server
    const response = await fetch(`/api/users/${auth.id}/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    // If the network request fails, revert the cart state
    if (!response.ok) {
      console.error(`Failed to update cart item with id ${id}`);
      setCart(cart); // Revert the cart state
    }
  };

  const checkout = async () => {
    const response = await fetch(`/api/users/${auth.id}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (response.ok) {
      setCart([]);
      setOrders([...orders, json]);
    } else {
      console.log(json);
    }
  };
  return (
    <Router>
      <div className="navbar">
        <Link to="/">Home</Link>
        {auth.id && <Link to="/cart">Cart</Link>}
        {auth.id && <Link to="/orders">Orders</Link>}
      </div>

      <Switch>
        <Route path="/cart">
          <Cart
            cart={cart}
            auth={auth}
            setCart={setCart} // pass setCart as a prop
            updateCart={updateCart}
            checkout={checkout}
            removeFromCart={removeFromCart}
          />
        </Route>

        <Route path="/orders">
          <Orders orders={orders} />
        </Route>

        <Route path="/">
          {!auth.id ? (
            <div className="auth-container">
              <AuthForm action={login} />
              <AuthForm action={register} />
            </div>
          ) : (
            <button onClick={logout}>Logout {auth.username}</button>
          )}
          <ul className="product-list">
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
                  {auth.id && (
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
                      <button onClick={() => addToCart(product.id)}>
                        Add to Cart
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

// import { useState, useEffect } from "react";
// import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
// import Login from "./components/Login";
// import ProductList from "./components/ProductList";
// import Cart from "./components/Cart";
// import Checkout from "./components/Checkout";
// import NavigationBar from "./components/NavigationBar";
// import ProductDetails from "./components/ProductDetails";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "./index.css";

// function App() {
//   // ... (rest of your code)

//   // Logout the user
//   const logout = () => {
//     window.localStorage.removeItem("token");
//     setAuth({});
//   };

//   return (
//     <BrowserRouter>
//       <div className="banner"> {/* Add banner */}
//         <h1>Welcome to Our Store!</h1>
//       </div>
//       <NavigationBar logout={logout} /> {/* Pass the logout function to the NavigationBar component */}
//       <div className="container"> {/* Add Bootstrap container class */}
//         <Switch>
//           {/* ... (rest of your routes) */}
//         </Switch>
//       </div>
//       <footer className="footer"> {/* Add footer */}
//         <p>© 2023 Our Store. All rights reserved.</p>
//       </footer>
//     </BrowserRouter>
//   );
// }

// export default App;

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
//       <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
//         <div className="carousel-inner">
//           {products.map((product, index) => (
//             <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
//               <img src={product.image} className="d-block w-100" alt={product.name} />
//               <div className="carousel-caption d-none d-md-block">
//                 <h5>{product.name}</h5>
//                 <p>{product.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
//           <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//           <span className="visually-hidden">Previous</span>
//         </button>
//         <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
//           <span className="carousel-control-next-icon" aria-hidden="true"></span>
//           <span className="visually-hidden">Next</span>
//         </button>
//       </div>
//       {/* ... (rest of your code) */}
//     </div>
//   );
// };
// export default ProductList;

// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { useState } from "react"; // Import useState

// const ProductList = ({
//   removeFavorite,
//   addFavorite,
//   addToCart,
//   products,
//   favorites,
//   cartisLoading,
// }) => {
//   const [search, setSearch] = useState(''); // Add state for search

//   const filteredProducts = products

/// filter and Sort products
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// const ProductList = ({
//   removeFavorite,
//   addFavorite,
//   addToCart,
//   products,
//   favorites,
//   cartisLoading,
// }) => {
//   const [search, setSearch] = useState('');
//   const [sort, setSort] = useState('name');
//   const [filter, setFilter] = useState('');

//   const filteredProducts = products
//     .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
//     .filter(product => filter ? product.category === filter : true)
//     .sort((a, b) => {
//       if (sort === 'name') {
//         return a.name.localeCompare(b.name);
//       } else if (sort === 'price') {
//         return a.price - b.price;
//       } else {
//         return 0;
//       }
//     });

//   // ... (rest of your code)

//   return (
//     <div className="row">
//       <div className="col-12">
//         <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
//         <select value={sort} onChange={(e) => setSort(e.target.value)}>
//           <option value="name">Sort by name</option>
//           <option value="price">Sort by price</option>
//         </select>
//         <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//           <option value="">Filter by category</option>
//           {/* Add your categories here */}
//           <option value="category1">Category 1</option>
//           <option value="category2">Category 2</option>
//         </select>
//       </div>
//       {/* ... (rest of your code) */}
//     </div>
//   );
// };
// export default ProductList;
