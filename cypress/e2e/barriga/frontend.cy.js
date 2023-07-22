/* eslint-disable no-console */
/// <reference types='cypress' />

// credenciais:
// Victor
// victor@pardinn
// 1234

import loc from '../../support/locators';
import '../../support/commandsContas';
import buildEnv from '../../support/buildEnv';

describe('Should test at a functional level', () => {
  // No longer needed. Latest versions of cypress already clear local storage automatically
  // after(() => {
  //   cy.clearLocalStorage();
  // });

  beforeEach(() => {
    buildEnv();
    cy.login('victor@pardinn', 'senhra');
    cy.get(loc.MENU.HOME).click();
    // cy.resetApp();
  });

  it('Should test responsiveness', () => {
    cy.get(loc.MENU.HOME).should('exist').and('be.visible');

    cy.viewport(500, 700);
    cy.get(loc.MENU.HOME).should('exist').and('not.be.visible');
    cy.viewport('samsung-s10');
    cy.get(loc.MENU.HOME).should('exist').and('not.be.visible');
    cy.viewport('ipad-2');
    cy.get(loc.MENU.HOME).should('exist').and('be.visible');
  });

  it('Should create an account', () => {
    cy.intercept('POST', '/contas', {
      id: 3,
      nome: 'Conta de teste',
      visivel: true,
      usuario_id: 1000,
    }).as('saveConta');

    cy.acessarMenuConta();

    cy.intercept('GET', '/contas', [
      {
        id: 1,
        nome: 'Carteira',
        visivel: true,
        usuario_id: 1000,
      },
      {
        id: 2,
        nome: 'Banco',
        visivel: true,
        usuario_id: 1000,
      },
      {
        id: 3,
        nome: 'Conta de teste',
        visivel: true,
        usuario_id: 1000,
      },
    ]).as('contasSave');

    cy.inserirConta('Conta de teste');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.intercept('PUT', '/contas/**', {
      id: 1,
      nome: 'Conta alterada',
      visivel: true,
      usuario_id: 1000,
    }).as('contasUpdate');

    cy.acessarMenuConta();
    cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Carteira')).click();
    cy.get(loc.CONTAS.NOME).clear().type('Conta alterada');
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an account with same name', () => {
    cy.intercept('POST', '/contas', {
      body: [{ error: 'Já existe uma conta com esse nome!' }],
      statusCode: 400,
    }).as('saveContaMesmoNome');

    cy.acessarMenuConta();

    cy.get(loc.CONTAS.NOME).type('Conta mesmo nome');
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it('Shoud create a transaction', () => {
    cy.intercept('POST', 'transacoes', {
      conta_id: 245134,
      data_pagamento: '2020-08-22T03:00:00.000Z',
      data_transacao: '2020-08-22T03:00:00.000Z',
      descricao: 'Desc',
      envolvido: 'Inter',
      id: 219754,
      observacao: null,
      parcelamento_id: null,
      status: true,
      tipo: 'REC',
      transferencia_id: null,
      usuario_id: 11053,
      valor: '123.00',
    }).as('saveMovimentacao');

    cy.intercept('GET', '/extrato/**', { fixture: 'movimentacaoSalva' }).as(
      'extrato',
    );

    cy.get(loc.MENU.MOVIMENTACAO).click();

    cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc');
    cy.get(loc.MOVIMENTACAO.VALOR).type('123');
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter');
    cy.get(loc.MOVIMENTACAO.CONTA).select('Banco');
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'inserida com sucesso');

    cy.get(loc.EXTRATO.LINHAS).should('have.length', 7);
    cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist');
  });

  it('Should get updated balance', () => {
    cy.intercept('GET', '/transacoes/**', {
      conta: 'Conta para saldo',
      id: 219571,
      descricao: 'Movimentacao 1, calculo saldo',
      envolvido: 'CCC',
      observacao: null,
      tipo: 'REC',
      data_transacao: '2020-08-22T03:00:00.000Z',
      data_pagamento: '2020-08-22T03:00:00.000Z',
      valor: '3500.00',
      status: false,
      conta_id: 245138,
      usuario_id: 11053,
      transferencia_id: null,
      parcelamento_id: null,
    });

    cy.intercept('PUT', '/transacoes/**', {
      conta: 'Conta para saldo',
      id: 219571,
      descricao: 'Movimentacao 1, calculo saldo',
      envolvido: 'CCC',
      observacao: null,
      tipo: 'REC',
      data_transacao: '2020-08-22T03:00:00.000Z',
      data_pagamento: '2020-08-22T03:00:00.000Z',
      valor: '3500.00',
      status: false,
      conta_id: 245138,
      usuario_id: 11053,
      transferencia_id: null,
      parcelamento_id: null,
    });

    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should(
      'contain',
      '100,00',
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

    cy.intercept('GET', '/saldo', [
      {
        conta_id: 999,
        conta: 'Carteira',
        saldo: '4034.00',
      },
      {
        conta_id: 9909,
        conta: 'Banco',
        saldo: '10000000,00',
      },
    ]).as('saldoFinal');

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should(
      'contain',
      '4.034,00',
    );
  });

  it('Should remove a transaction', () => {
    cy.intercept('DELETE', '/transacoes/**', {
      body: {},
      statusCode: 204,
    }).as('del');

    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(
      loc.EXTRATO.FN_XP_BTN_EXCLUIR('Movimentacao para exclusao'),
    ).click();
    cy.get(loc.MESSAGE).should('contain', 'removida com sucesso');
  });

  it('Should validate data sent to create an account', () => {
    cy.intercept(
      'POST',
      '/contas',
      {
        id: 3,
        nome: 'Conta de teste',
        visivel: true,
        usuario_id: 1000,
      },
      // After cy.route() got removed, this example became obsolete
      // onRequest: (req) => {
      //   console.log(req);
      //   expect(req.request.body.nome).to.be.empty;
      //   expect(req.request.headers).to.have.property('Authorization');
      // },
      // onRequest: reqStub,
    ).as('saveConta');

    cy.acessarMenuConta();

    cy.intercept('GET', '/contas', [
      {
        id: 1,
        nome: 'Carteira',
        visivel: true,
        usuario_id: 1000,
      },
      {
        id: 2,
        nome: 'Banco',
        visivel: true,
        usuario_id: 1000,
      },
      {
        id: 3,
        nome: 'Conta de teste',
        visivel: true,
        usuario_id: 1000,
      },
    ]).as('contasSave');

    cy.inserirConta('{CONTROL}');
    // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty');
    cy.wait('@saveConta').then((reqStub) => {
      console.log(reqStub.request);
      expect(reqStub.request.body.nome).to.be.empty;
      expect(reqStub.request.headers).to.have.property('authorization');
    });
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should test colors', () => {
    cy.intercept('GET', '/extrato/**', [
      {
        conta: 'Conta para movimentacoes',
        id: 219569,
        descricao: 'Receita paga',
        envolvido: 'AAA',
        observacao: null,
        tipo: 'REC',
        data_transacao: '2020-08-22T03:00:00.000Z',
        data_pagamento: '2020-08-22T03:00:00.000Z',
        valor: '-1500.00',
        status: true,
        conta_id: 245136,
        usuario_id: 11053,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: 'Conta com movimentacao',
        id: 219570,
        descricao: 'Receita pendente',
        envolvido: 'BBB',
        observacao: null,
        tipo: 'REC',
        data_transacao: '2020-08-22T03:00:00.000Z',
        data_pagamento: '2020-08-22T03:00:00.000Z',
        valor: '-1500.00',
        status: false,
        conta_id: 245137,
        usuario_id: 11053,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: 'Conta para saldo',
        id: 219571,
        descricao: 'Despesa paga',
        envolvido: 'CCC',
        observacao: null,
        tipo: 'DESP',
        data_transacao: '2020-08-22T03:00:00.000Z',
        data_pagamento: '2020-08-22T03:00:00.000Z',
        valor: '3500.00',
        status: true,
        conta_id: 245138,
        usuario_id: 11053,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: 'Conta para saldo',
        id: 219572,
        descricao: 'Despesa pendente',
        envolvido: 'DDD',
        observacao: null,
        tipo: 'DESP',
        data_transacao: '2020-08-22T03:00:00.000Z',
        data_pagamento: '2020-08-22T03:00:00.000Z',
        valor: '-1000.00',
        status: false,
        conta_id: 245138,
        usuario_id: 11053,
        transferencia_id: null,
        parcelamento_id: null,
      },
    ]).as('extrato');
    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should(
      'have.class',
      'receitaPaga',
    );
    cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita pendente')).should(
      'have.class',
      'receitaPendente',
    );
    cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa paga')).should(
      'have.class',
      'despesaPaga',
    );
    cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa pendente')).should(
      'have.class',
      'despesaPendente',
    );
  });
});
