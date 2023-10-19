function multiplication(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both inputs must be numbers");
  }
  return a * b;
}

function concatOdds(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new Error("Both inputs must be arrays");
  }
  let odds = [];
  arr1.concat(arr2).forEach((num) => {
    if (typeof num !== "number") {
      throw new Error("Arrays should only contain numbers");
    }
    if (num % 2 !== 0) {
      odds.push(num);
    }
  });
  return odds.sort((a, b) => a - b);
}

// Test multiplication
console.log(multiplication(2, 3)); // Expected: 6
console.log(multiplication(-1, -2)); // Expected: 2

// Test concatOdds
console.log(concatOdds([3, 2, 1], [9, 1, 1, 1, 4, 15, -1])); // Expected: [-1, 1, 3, 9, 15]

// Testing unexpected inputs
try {
  console.log(multiplication("2", 3)); // Expected: Error('Both inputs must be numbers')
} catch (error) {
  console.error(error.message);
}

try {
  console.log(concatOdds([3, 2, 1], "hello")); // Expected: Error('Both inputs must be arrays')
} catch (error) {
  console.error(error.message);
}
