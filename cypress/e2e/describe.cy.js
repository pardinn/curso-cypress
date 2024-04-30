/// <reference types="cypress" />

it('An external test...', () => {

});

describe('Should group tests...', () => {
  describe('Should group more specific tests...', () => {
    it('A specific test...', () => {

    });
  });

  describe.skip('Should group more specific tests 2...', () => {
    it('A specific test 2...', () => {

    });
  });

  it('An internal test...', () => {

  });
});
