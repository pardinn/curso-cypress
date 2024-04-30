/* eslint-disable no-console */
/// <reference types='cypress' />

describe('Working with alerts', () => {
  beforeEach(() => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');
  });

  it('Alert', () => {
    // cy.get('#alert').click();
    // cy.on('window:alert', (msg) => {
    //   expect(msg).to.be.equal('Alert Simples');
    // });
    cy.clickAlert('#alert', 'Alert Simples');
  });

  it('Alert com Mock', () => {
    const stub = cy.stub().as('alerta');
    cy.on('window:alert', stub);
    cy.get('#alert').click();
    cy.get('@alerta').should('have.been.calledWith', 'Alert Simples');
  });

  it('Confirm', () => {
    cy.on('window:confirm', (msg) => {
      expect(msg).to.be.equal('Confirm Simples');
    });
    cy.on('window:alert', (msg) => {
      expect(msg).to.be.equal('Confirmado');
    });
    cy.get('#confirm').click();
  });

  it('Deny', () => {
    cy.on('window:confirm', (msg) => {
      expect(msg).to.be.equal('Confirm Simples');
      return false;
    });
    cy.on('window:alert', (msg) => {
      expect(msg).to.be.equal('Negado');
    });
    cy.get('#confirm').click();
  });

  it('Prompt', () => {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('42');
    });
    cy.on('window:confirm', (msg) => {
      expect(msg).to.be.equal('Era 42?');
    });
    cy.on('window:alert', (msg) => {
      expect(msg).to.be.equal(':D');
    });
    cy.get('#prompt').click();
  });

  it('Validando mensagens', () => {
    const stub = cy.stub().as('alerta');
    cy.on('window:alert', stub);

    cy.get('#formCadastrar').click();
    cy.get('@alerta').should('have.been.calledWith', 'Nome eh obrigatorio');

    cy.get('#formNome').type('Victor');
    cy.get('#formCadastrar').click();
    cy.get('@alerta').should(
      'have.been.calledWith',
      'Sobrenome eh obrigatorio',
    );

    cy.get('[data-cy=dataSobrenome]').type('Moraes');
    cy.get('#formCadastrar').click();
    cy.get('@alerta').should('have.been.calledWith', 'Sexo eh obrigatorio');

    cy.get('#formSexoMasc').click();
    cy.get('#formCadastrar').click();

    cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!');
    cy.get('#descNome').should('contain', 'Victor');
    cy.get('#descSobrenome').should('contain', 'Moraes');
    cy.get('#descSexo').should('contain', 'Masculino');
  });
});
