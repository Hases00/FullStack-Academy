import PropTypes from "prop-types";
import { useState } from "react";

// Login component
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = (ev) => {
    ev.preventDefault();
    login({ username, password });
    // console.log(username, password);
  };

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
      setAuth(json.user);
    } else {
      console.log(json);
      const error = await response.json();
      throw new Error(error.message);
    }
  };

  const submitRegister = async () => {
    try {
      await register({ username, password });
    } catch (err) {
      // setError(err.message);
    }
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
    console.log(json);
    if (response.ok) {
      login({ username, password });
    } else {
      console.log(json);
    }
  };

  return (
    <div>
      <form>
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
      </form>
      <button disabled={!username || !password} onClick={submitLogin}>
        Login
      </button>
      <button disabled={!username || !password} onClick={submitRegister}>
        Register
      </button>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func,
  setAuth: PropTypes.func,
};
export default Login;
