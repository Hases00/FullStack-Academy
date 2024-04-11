// import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const [auth, setAuth] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartisLoading, setCartisLoading] = useState(false);

  // fetch Authentication
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

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();
      setProducts(json);
    };

    fetchProducts();
  }, []);

  // fetch Cart
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

  useEffect(() => {
    if (auth.id) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [auth]);

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

  //functions Scene

  // Add to cart

  const addToCart = async (product_id) => {
    setCartisLoading(true);
    const response = await fetch(`/api/users/${auth.id}/cart`, {
      method: "POST",
      body: JSON.stringify({ user_id: auth.id, product_id, quantity: 1 }), // add user_id and quantity
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    setCartisLoading(false);
    if (response.ok) {
      fetchCart();
    } else {
      console.error("Error fetching cart", json);
    }
  };

  // Add favortes
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
      console.error("Error Adding favorite", json);
    }
  };

  // RemoveFavorite
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
      console.error("Error removing favorites");
    }
  };
  // Remove Cart Items
  const removeFromCart = async (id) => {
    // setCart(cart.filter((item) => item.id !== id));

    const response = await fetch(`/api/users/${auth.id}/product/${id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });
    if (!response.ok) {
      console.error(`Failed to remove cart item with id ${id}`);
      // setCart(cart); // Revert the cart state
    }
    fetchCart();
  };
  // // Update the cart
  const updateCart = async ({ product_id, quantity }) => {
    const response = await fetch(`/api/users/${auth.id}/cart`, {
      method: "PUT",
      body: JSON.stringify({ product_id, quantity }),
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });
    if (!response.ok) {
      console.error(`Failed to update cart item with id ${product_id}`);
      // setCart(cart); // Revert the cart state
    }
    fetchCart();
  };

  // Checkout items
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
      return true;
    } else {
      console.error("Checkout error", json);
    }
  };
  // Logout the user
  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
  };

  return (
    <BrowserRouter>
      <NavigationBar auth={auth} logout={logout} />
      <div className="container">
        <Switch>
          <Route path="/login">
            {auth.id ? <Redirect to="/" /> : <Login setAuth={setAuth} />}
          </Route>
          <Route path="/cart">
            {!auth.id ? (
              <Redirect to="/login" />
            ) : (
              <Cart
                cart={cart}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
                checkout={checkout}
              />
            )}
          </Route>
          <Route path="/checkout">
            {!auth.id ? <Redirect to="/login" /> : <Checkout orders={orders} />}
          </Route>
          <Route path="/product/:id">
            {!auth.id ? (
              <Redirect to="/login" />
            ) : (
              <ProductDetails addToCart={addToCart} />
            )}
          </Route>
          <Route path="/">
            <ProductList
              products={products}
              favorites={auth.id ? favorites : []}
              addFavorite={auth.id ? addFavorite : null}
              removeFavorite={auth.id ? removeFavorite : null}
              addToCart={auth.id ? addToCart : null}
              cartisLoading={cartisLoading}
              cart={cart}
              removeFromCart={removeFromCart}
              auth={auth}
            />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
