/* eslint-disable no-console */
/* eslint-disable arrow-parens */
/// <reference types="cypress" />

describe('Work with basic elements', () => {
  beforeEach(() => {
    cy.visit('https://www.wcaquino.me/cypress/componentes.html');
  });

  it('Deve aguardar elemento estar disponivel', () => {
    cy.get('#novoCampo').should('not.exist');
    cy.get('#buttonDelay').click();
    cy.get('#novoCampo').should('not.exist');
    cy.get('#novoCampo').should('exist');
    cy.get('#novoCampo').type('funciona');
  });

  it('Deve fazer retries', () => {
    cy.get('#novoCampo').should('not.exist');
    cy.get('#buttonDelay').click();
    cy.get('#novoCampo').should('not.exist');
    cy.get('#novoCampo')
      // .should('not.exist')
      .should('exist')
      .type('funciona');
  });

  it.only('Uso do find', () => {
    cy.get('#buttonList').click();
    cy.get('#lista li').find('span').should('contain', 'Item 1');
    // cy.get('#lista li')
    //   .find('span')
    //   .should('contain', 'Item 2');
    cy.get('#lista li span').should('contain', 'Item 2');

    cy.get('#buttonListDOM').click();
    cy.get('#lista li').find('span').should('contain', 'Item 1');
    // cy.get('#lista li')
    //   .find('span')
    //   .should('contain', 'Item 2');
    cy.get('#lista li span').should('contain', 'Item 2');
  });

  it.only('Uso do timeout', () => {
    // cy.get('#buttonDelay').click()
    // cy.get('#novoCampo', { timeout: 1000 }).should('exist')
    /**
     * A linha acima demonstra como inserir timeout pontual.
     * Se eu quiser alterar o padrão de timeout do cypress,
     * preciso incluir o atributo "defaultCommandTimeout" dentro do arquivo cypress.json
     */

    // cy.get('#buttonListDOM').click()
    // cy.wait(5000)
    // cy.get('#lista li span', { timeout: 30000 })
    //   .should('contain', 'Item 2')

    // cy.get('#buttonListDOM').click()
    // cy.get('#lista li span', { timeout: 20000 })
    //   .should('have.length', 1)
    //   .should('have.length', 2)

    cy.get('#buttonListDOM').click();
    cy.get('#lista li span').should('have.length', 1);
    cy.get('#lista li span').should('have.length', 2);
  });

  it.only('Click retry', () => {
    cy.get('#buttonCount').click().click().should('have.value', '111');
  });

  it.only('Should vs Then', () => {
    // 1. 'should' fica executando a função enquanto aguarda o 'get' finalizar
    // cy.get('#buttonListDOM').click();
    // cy.get('#lista li span').should($el => {
    //   console.log($el);
    //   expect($el).to.have.length(1);
    // });

    // 2. 'then' espera até que o 'get' finalize para executar para executar
    // cy.get('#buttonListDOM').click();
    // cy.get('#lista li span').then($el => {
    //   console.log($el);
    //   expect($el).to.have.length(1);
    // });

    // 3. 'should' ignora o return interno
    // cy.get('#buttonListDOM').should($el => {
    //   expect($el).to.have.length(1);
    //   return 2;
    // }).and('have.id', 'buttonListDOM');

    // 4. 'then' utiliza o return interno nas chamadas externas
    // cy.get('#buttonListDOM').then($el => {
    //   expect($el).to.have.length(1);
    //   return 2;
    // }).and('eq', 2)
    //   .and('not.have.id', 'buttonListDOM');

    // 5. 'should' fica maluco quando tem um get interno
    // cy.get('#buttonListDOM').should($el => {
    //   expect($el).to.have.length(1);
    //   // cy.get('#buttonList');
    // });

    // 6. 'then' pode ser útil nesse cenário
    cy.get('#buttonListDOM').then(($el) => {
      // 'then' espera até que o 'get' finalize para executar para executar
      // utiliza o return de dentro da função
      // console.log($el);
      expect($el).to.have.length(1);
      cy.get('#buttonList');
    });
  });
});
