function addition(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both inputs must be numbers");
  }
  return a + b;
}

try {
  const result = addition(2, 3);
  console.log(typeof result); // Output: "number"
  console.log(result === 5); // Output: "true"
} catch (error) {
  console.error(error);
}

try {
  const result = addition("a", 3);
  console.log(typeof result); // This line won't be executed
} catch (error) {
  console.error(error.message); // Output: "Both inputs must be numbers"
}
