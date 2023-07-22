/* eslint-disable no-console */
/// <reference types='cypress' />

// credenciais:
// Victor
// victor@pardinn
// 1234

import loc from '../../support/locators';
import '../../support/commandsContas';

describe('Should test at a functional level', () => {
  beforeEach(() => {
    cy.login('victor@pardinn', '1234');
    cy.get(loc.MENU.HOME).click();
    cy.resetApp();
  });

  it('Should create an account', () => {
    cy.acessarMenuConta();
    cy.inserirConta('Minha primeira conta');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.acessarMenuConta();
    cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Conta para alterar')).click();
    cy.get(loc.CONTAS.NOME).clear().type('Conta alterada');
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an account with same name', () => {
    cy.acessarMenuConta();

    cy.get(loc.CONTAS.NOME).type('Conta mesmo nome');
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it('Shoud create a transaction', () => {
    cy.get(loc.MENU.MOVIMENTACAO).click();

    cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc');
    cy.get(loc.MESSAGE).should('not.exist');
    cy.get(loc.MOVIMENTACAO.VALOR).type('123');
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter');
    cy.get(loc.MOVIMENTACAO.CONTA).select('Conta para movimentacoes');
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'inserida com sucesso');

    cy.get(loc.EXTRATO.LINHAS).should('have.length', 7);
    cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist');
  });

  it('Should get updated balance', () => {
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should(
      'contain',
      '534,00',
    );

    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(
      loc.EXTRATO.FN_XP_BTN_EDITAR('Movimentacao 1, calculo saldo'),
    ).click();
    cy.get(loc.MOVIMENTACAO.DESCRICAO).should(
      'have.value',
      'Movimentacao 1, calculo saldo',
    );
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'alterada com sucesso');

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should(
      'contain',
      '4.034,00',
    );
  });

  it('Should remove a transaction', () => {
    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(
      loc.EXTRATO.FN_XP_BTN_EXCLUIR('Movimentacao para exclusao'),
    ).click();
    cy.get(loc.MESSAGE).should('contain', 'removida com sucesso');
  });
});
