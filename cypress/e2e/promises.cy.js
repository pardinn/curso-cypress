/* eslint-disable no-console */
it('sem testes, ainda', () => { });

const getSomething = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(13);
  }, 1000);
});

const system = () => {
  console.log('init');
  getSomething().then((some) => {
    console.log(`Something is ${some}`);
  });
  console.log('end');
};

system();
