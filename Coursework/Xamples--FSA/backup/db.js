const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/Market_auth_store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS categories;

    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT false
    );

    CREATE TABLE categories(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(20) UNIQUE NOT NULL
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(20) NOT NULL,
      price NUMERIC NOT NULL,
      quantity INTEGER NOT NULL,
      description TEXT,
      image TEXT,
      category_id UUID REFERENCES categories(id)
    );

    CREATE TABLE cart(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL
    );

    CREATE TABLE favorites(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      order_date TIMESTAMP NOT NULL
    );

    CREATE TABLE order_items(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID REFERENCES orders(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL
    );
  `;
  await client.query(SQL);
};

//User
const createUser = async ({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return { id: response.rows[0].id, username: response.rows[0].username };
};

const authenticate = async ({ username, password }) => {
  if (!username || !password) {
    const error = Error("not authorized, missing username or password");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, password, username 
    FROM users
    WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  console.log(response.rows);
  if (
    (!response.rows.length ||
      (await bcrypt.compare(password, response.rows[0].password))) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return {
    token: token,
    user: {
      id: response.rows[0].id,
      username: response.rows[0].username,
    },
  };
};

const findUserWithToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Favorite
const fetchFavorites = async (user_id) => {
  const SQL = `
    SELECT * FROM favorites where user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

const destroyFavorite = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM favorites WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

// Products
const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const updateProduct = async ({
  id,
  name,
  price,
  quantity,
  description,
  category_id,
}) => {
  const SQL = `
    UPDATE products
    SET name = $2, price = $3, quantity = $4, description = $5, category_id = $6
    WHERE id = $1
    RETURNING *
  `;
  const response = await client.query(SQL, [
    id,
    name,
    price,
    quantity,
    description,
    category_id,
  ]);
  return response.rows[0];
};

const createProduct = async ({
  name,
  price,
  quantity,
  description,
  image,
  category_id,
}) => {
  const SQL = `
    INSERT INTO products(id, name, price, quantity, description, image, category_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    price,
    quantity,
    description,
    image,
    category_id,
  ]);
  return response.rows[0];
};

const destroyProduct = async (product_id) => {
  const SQL = `
    DELETE FROM products WHERE id = $1
  `;
  await client.query(SQL, [product_id]);
};

// Category
const createCategory = async ({ name }) => {
  const SQL = `
    INSERT INTO categories(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const fetchCategories = async () => {
  const SQL = `
    SELECT * FROM categories
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Cart
const addToCart = async ({ user_id, product_id, quantity }) => {
  const SQL = `
    INSERT INTO cart(id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    product_id,
    quantity,
  ]);
  return response.rows[0];
};

const removeFromCart = async ({ user_id, product_id }) => {
  const SQL = `
    DELETE FROM cart WHERE user_id=$1 AND product_id=$2
  `;
  await client.query(SQL, [user_id, product_id]);
};

const checkout = async (user_id) => {
  const SQL = `
    INSERT INTO orders(id, user_id, order_date) VALUES($1, $2, NOW()) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id]);
  return response.rows[0];
};

const createCartItem = async ({ user_id, product_id, quantity }) => {
  const SQL = `
    INSERT INTO cart(id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    product_id,
    quantity,
  ]);
  return response.rows[0];
};

const updateCart = async ({ id, user_id, product_id, quantity }) => {
  const SQL = `
    UPDATE cart
    SET user_id = $2, product_id = $3, quantity = $4
    WHERE id = $1
    RETURNING *
  `;
  const response = await client.query(SQL, [id, user_id, product_id, quantity]);
  return response.rows[0];
};
// INSERT INTO cartItems (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = $3 RETURNING *

const fetchCart = async (user_id) => {
  const SQL = `
    SELECT c.*, p.* 
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows.map((row) => ({
    ...row,
    product: {
      id: row.product_id,
      name: row.name,
      price: row.price,
      // include other product properties here
    },
  }));
};

const fetchCartTotal = async (user_id) => {
  const SQL = `
    SELECT SUM(p.price * c.quantity) as total
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows[0].total;
};

// Administrator

const isAdmin2 = async (user_id) => {
  const SQL = `
    SELECT is_admin FROM users WHERE id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows[0].is_admin;
};

// Orders
const fetchOrders = async (user_id) => {
  const SQL = `
    SELECT * FROM orders WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const fetchOrderItems = async (order_id) => {
  const SQL = `
    SELECT * FROM order_items WHERE order_id = $1
  `;
  const response = await client.query(SQL, [order_id]);
  return response.rows;
};

const fetchOrderTotal = async (order_id) => {
  const SQL = `
    SELECT SUM(p.price * oi.quantity) as total
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `;
  const response = await client.query(SQL, [order_id]);
  return response.rows[0].total;
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  createCategory,
  fetchCategories,
  addToCart,
  removeFromCart,
  checkout,
  updateProduct,
  destroyProduct,
  updateCart,
  isAdmin2,
  createCartItem,
  fetchCart,
  fetchCartTotal,
  fetchOrders,
  fetchOrderItems,
  fetchOrderTotal,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  destroyFavorite,
  authenticate,
  findUserWithToken,
};
