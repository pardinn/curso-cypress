/// <reference types='cypress' />

describe("Working with time", () => {
  beforeEach(() => {
    cy.visit("https://wcaquino.me/cypress/componentes.html");
  });

  it("Going back to the past", () => {
    // cy.get('#buttonNow').click();
    // cy.get('#resultado > span').should('contain', '01/08/2020');

    // cy.clock();
    // cy.get('#buttonNow').click();
    // cy.get('#resultado > span').should('contain', '31/12/1969');

    const dt = new Date(2012, 3, 10, 15, 23, 50);
    cy.clock(dt.getTime());
    cy.get("#buttonNow").click();
    cy.get("#resultado > span").should("contain", "10/04/2012");
  });

  it("Goes to the future", () => {
    // cy.get('#buttonTimePassed').click();
    // cy.get('#resultado > span').should('contain', '15963');
    // cy.get('#resultado > span').invoke('text').then(parseFloat).should('be.gt', 1596320392973);

    cy.clock();
    cy.get("#buttonTimePassed").click();
    cy.get("#resultado > span")
      .invoke("text")
      .then(parseFloat)
      .should("be.lte", 0);
    // cy.wait(1000);
    // cy.get('#buttonTimePassed').click();
    // cy.get('#resultado > span').invoke('text').should('be.lte', 1000);

    cy.tick(5000);
    cy.get("#buttonTimePassed").click();
    cy.get("#resultado > span")
      .invoke("text")
      .then(parseFloat)
      .should("be.gte", 5000);

    cy.tick(10000);
    cy.get("#buttonTimePassed").click();
    cy.get("#resultado > span")
      .invoke("text")
      .then(parseFloat)
      .should("be.gte", 15000);
  });
});
