const squaresEl = document.querySelector('#squares')

const colors = ['red', 'blue', 'green']
const squares = []

function render () {
  const template = squares.map(square => {
    const newSquare = document.createElement('div');
    newSquare.classList.add('square');
    newSquare.classList.add(square.color);
    // newSquare.style.backgroundColor = `rgb(${Math.floor(
    //   Math.random() * 256
    //  )},${Math.floor(Math.random() * 256)},${Math.floor(
    //   Math.random() * 256
    //  )})`
    return newSquare;
  })

  squaresEl.replaceChildren(...template);
}

function addSquare() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  squares.push({
    color: randomColor,
    size: 'small'
  })
  render();
}

const seconds = 5 * 100;

const id = setInterval(() => {
  addSquare();

}, seconds)


const h1 = document.querySelector('h1');
h1.textContent = "<i>Hello World</i>"