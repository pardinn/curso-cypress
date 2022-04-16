/* eslint-disable no-console */
/// <reference types='cypress' />

// credenciais:
// Victor
// victor@pardinn
// 1234

import dayjs from 'dayjs';

describe('Should test at a functional level', () => {
  // let token;

  before(() => {
    cy.getToken('victor@pardinn', '1234');
    // .then((tkn) => {
    //   token = tkn;
    // });
  });

  beforeEach(() => {
    // cy.resetRest(token);
    cy.resetRest();
  });

  it('Should create an account', () => {
    cy.request({
      url: '/contas',
      method: 'POST',
      // headers: { Authorization: `JWT ${token}` },
      body: {
        nome: 'Conta via rest',
      },
    }).as('response');

    cy.get('@response').then((res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('nome', 'Conta via rest');
    });
  });

  it('Should update an account', () => {
    cy.getContaByName('Conta para alterar')// , token)
      .then((contaId) => {
        cy.request({
          url: `/contas/${contaId}`,
          method: 'PUT',
          // headers: { Authorization: `JWT ${token}` },
          body: {
            nome: 'Conta alterada via rest',
          },
        }).as('response');
      });

    cy.get('@response').its('status').should('be.equal', 200);
  });

  it('Should not create an account with same name', () => {
    cy.request({
      url: '/contas',
      method: 'POST',
      // headers: { Authorization: `JWT ${token}` },
      body: {
        nome: 'Conta mesmo nome',
      },
      failOnStatusCode: false,
    }).as('response');

    cy.get('@response').then((res) => {
      expect(res.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!');
    });
  });

  it('Shoud create a transaction', () => {
    cy.getContaByName('Conta para movimentacoes') // , token)
      .then((contaId) => {
        cy.request({
          url: '/transacoes',
          method: 'POST',
          // headers: { Authorization: `JWT ${token}` },
          body: {
            conta_id: contaId,
            data_pagamento: dayjs().add(1, 'day').format('DD/MM/YYYY'),
            data_transacao: dayjs().format('DD/MM/YYYY'),
            descricao: 'desc',
            envolvido: 'inter',
            status: true,
            tipo: 'REC',
            valor: '123',
          },
        }).as('response');
      });

    cy.get('@response').its('status').should('be.equal', 201);
    cy.get('@response').its('body.id').should('exist');
  });

  it('Should get updated balance', () => {
    // check initial balance
    cy.request({
      url: '/saldo',
      method: 'GET',
      // headers: { Authorization: `JWT ${token}` },
    }).then((res) => {
      let saldoConta = null;
      res.body.forEach((c) => {
        if (c.conta === 'Conta para saldo') saldoConta = c.saldo;
      });
      expect(saldoConta).to.be.equal('534.00');
    });

    // change a transaction
    cy.getTransactionByName('Movimentacao 1, calculo saldo') // , token)
      .then((res) => {
        cy.request({
          url: `/transacoes/${res.id}`,
          method: 'PUT',
          // headers: { Authorization: `JWT ${token}` },
          body: {
            status: true,
            data_transacao: dayjs(res.data_transacao).format('DD/MM/YYYY'),
            data_pagamento: dayjs(res.data_pagamento).format('DD/MM/YYYY'),
            descricao: res.descricao,
            envolvido: res.envolvido,
            valor: res.valor,
            conta_id: res.conta_id,
          },
        }).its('status').should('be.equal', 200);
      });

    // check if balance is updated
    cy.request({
      url: '/saldo',
      method: 'GET',
      // headers: { Authorization: `JWT ${token}` },
    }).then((res) => {
      let saldoConta = null;
      res.body.forEach((c) => {
        if (c.conta === 'Conta para saldo') saldoConta = c.saldo;
      });
      expect(saldoConta).to.be.equal('4034.00');
    });
  });

  it('Should remove a transaction', () => {
    cy.getTransactionByName('Movimentacao para exclusao') // , token)
      .then((res) => {
        cy.request({
          url: `/transacoes/${res.id}`,
          method: 'DELETE',
          // headers: { Authorization: `JWT ${token}` },
        }).its('status').should('be.equal', 204);
      });
  });
});
