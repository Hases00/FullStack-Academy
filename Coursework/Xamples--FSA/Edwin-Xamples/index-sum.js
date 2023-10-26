// using function declaration syntax
function add(x, y) {
  return x + y;
}

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce(add, 0);

// higher order functions
const sum2 = numbers.reduce((result, number) => result + number, 0);

console.log(sum);
console.log(sum2);
