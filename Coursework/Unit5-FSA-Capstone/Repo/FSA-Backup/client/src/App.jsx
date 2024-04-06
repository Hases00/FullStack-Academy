// import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./index.css";

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
    console.log(json);
    if (response.ok) {
      fetchCart();
    } else {
      console.log(json);
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
      console.log(json);
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
      console.log();
    }
  };
  // Remove Cart Items
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
  // Update the cart

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
    } else {
      console.log(json);
    }
  };

  return (
    <BrowserRouter>
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
        <Route path="/">
          {" "}
          {!auth.id ? (
            <Redirect to="/login" />
          ) : (
            <ProductList
              products={products}
              favorites={favorites}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
              addToCart={addToCart}
              cartisLoading={cartisLoading}
            />
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
