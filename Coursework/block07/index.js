// You are building a vault that requires three mathematical calculations to generate the three codes in a combination.
// Create three variables. Each variable will be the result of each calculation (three in total)
// The combination of the lock is 10 - 40 - 39. You must use three different arithmetic operators
// that will generate each individual number, then display the combination on the HTML page, or in an alert popup.

window.alert(
  "You have received this message because you have been chosen to open an important vault"
); // Show an alert with a message pop up inside the website
alert(
  "You have received this message because you have been chosen to open an important vault"
);

let numGuests = 5 + 5; // plus Two numbers that result have to be 10
let numGuests2 = 80 / 2; // Divide Two numbers that result have to be 10
let numGuests3 = 40 - 1; // Subtract Two numbers that result have to be 10
let entry = "Your codes are:"; // variable with any text
let symbol = "-"; // variable for uses for separate other variables
alert(
  entry +
    " " +
    numGuests +
    " " +
    symbol +
    numGuests2 +
    " " +
    symbol +
    numGuests3
);
