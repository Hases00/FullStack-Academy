//Prompt the user for a list of integers separated by commas
const str = window.prompt("enter some numbers, like this", "1,2,3,3,5,9");

// Complete the Numbers class below
// the constructor has already been provided
class Numbers {
  constructor(data) {
    //data can either be a string or an array of numbers
    if (typeof data === "string") {
      this.data = str.split(",").map((number) => number * 1);
    } else {
      this.data = data;
    }
  }
  count() {
    return this.data.length;
    //return the count of numbers in data
  }
  printNumbers() {
    for (let i = 0; i < this.data.length; i++) {
      console.log(`Number: ${this.data[i]}, Index: ${i}`);
    }
    //print the numbers in data
  }
  odds() {
    return this.data.filter((number) => number % 2 !== 0);
    //return the odd numbers in data
  }
  evens() {
    return this.data.filter((number) => number % 2 === 0);
    //return the even numbers in data
  }
  sum() {
    return this.data.reduce((acc, cur) => acc + cur, 0);
    //return the sum of the numbers
  }
  product() {
    return this.data.reduce((acc, cur) => acc * cur, 1);
    //return the product of the numbers
  }
  greaterThan(target) {
    return this.data.filter((number) => number > target);
    //return the numbers greater than the target
  }
  howMany(target) {
    return this.data.filter((number) => number === target).length;
    //return the count of a given number
  }
}

// Create an instance of numbers //
const n1 = new Numbers(str);
console.log(n1.count()); //returns count of numbers
n1.printNumbers(); //prints the number along with their indexes
console.log(n1.odds()); //returns odd numbers
console.log(n1.evens()); //returns even numbers
console.log(n1.sum()); //returns sum of numbers
console.log(n1.product()); //returns product of numbers
console.log(n1.greaterThan(3)); //returns numbers greater than another number
console.log(n1.howMany(3)); //return the count of a specific number

// Order matters on this case, can't call  new Numbers if doesn't exist first! //
