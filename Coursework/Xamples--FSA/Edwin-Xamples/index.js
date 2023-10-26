// using function declaration syntax
function addD(x, y) {
  return x + y;
}

// using function expression syntax
const addE = function (x, y) {
  return x + y;
};

// using arrow syntax
const addA = (x, y) => {
  return x + y;
};

// using arrow syntax, implicit return
const addI = (x, y) => x + y;

console.log(addD(2, 2));
console.log(addE(2, 2));
console.log(addA(2, 2));
console.log(addI(2, 2));
