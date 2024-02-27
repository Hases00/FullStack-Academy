// imports here for express and pg
const express = require("express");
const path = require("path");
const pg = require("pg");

const app = express();
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_hr_db"
);

// static routes here (you only need these for deployment)
app.use(express.static(path.join(__dirname, "../client/dist")));

// app routes here
app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = "SELECT * FROM employees";
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// create your init function
const init = async () => {
  await client.connect();
  const SQL = `
    DROP TABLE IF EXISTS employees;
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      is_admin BOOLEAN DEFAULT FALSE
    );
    INSERT INTO employees(name, is_admin) VALUES('John Doe', true);
    INSERT INTO employees(name, is_admin) VALUES('Jane Smith', false);
  `;
  await client.query(SQL);
  console.log("Data seeded");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
};

// init function invocation
init();
