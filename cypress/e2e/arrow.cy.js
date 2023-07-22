/* eslint-disable no-console */
it('nada agora', () => { });

// function soma(a, b) {
//     return a + b;
// }

// const soma = function (a, b) {
//     return a + b;
// }

// const soma = (a, b) => {
//     return a + b;
// }

// const soma = (a, b) => a + b

// const soma = (a) => a + a

// const soma = a => a + a
const soma = () => 5 + 5;

console.log(soma(1, 4));

// eslint-disable-next-line func-names
it('a function test...', function () {
  console.log('Function', this);
});

it('an arrow test...', () => {
  console.log('Arrow', this);
});
