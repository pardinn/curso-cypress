const locators = {
  LOGIN: {
    USER: '[data-test=email]',
    PASSWORD: '[data-test=passwd]',
    BTN_LOGIN: '.btn',
  },
  MENU: {
    HOME: '[data-test=menu-home]',
    MOVIMENTACAO: '[data-test=menu-movimentacao]',
    EXTRATO: '[data-test=menu-extrato]',
    SETTINGS: '[data-test=menu-settings]',
    CONTAS: '[href="/contas"]',
    RESET: '[href="/reset"]',
  },
  CONTAS: {
    NOME: '[data-test=nome]',
    BTN_SALVAR: '.btn',
    FN_XP_BTN_ALTERAR: (nome) => `//table//td[contains(text(),'${nome}')]/..//i[@class='far fa-edit']`,
  },
  MOVIMENTACAO: {
    DESCRICAO: '[data-test=descricao]',
    VALOR: '[data-test=valor]',
    INTERESSADO: '[data-test=envolvido]',
    CONTA: '[data-test=conta]',
    STATUS: '[data-test=status]',
    BTN_SALVAR: '.btn-primary',
  },
  EXTRATO: {
    LINHAS: '.list-group > li',
    FN_XP_BUSCA_ELEMENTO: (desc, valor) => `//span[contains(., '${desc}')]/following-sibling::small[contains(.,'${valor}')]`,
    FN_XP_BTN_EDITAR: (desc) => `//span[contains(.,'${desc}')]/../../..//i[@class='fas fa-edit']`,
    FN_XP_BTN_EXCLUIR: (desc) => `//span[contains(.,'${desc}')]/../../..//i[@class='far fa-trash-alt']`,
    FN_XP_LINHA: (desc) => `//span[contains(.,'${desc}')]/../../../..`,
  },
  SALDO: {
    FN_XP_SALDO_CONTA: (nome) => `//td[contains(., '${nome}')]/../td[2]`,
  },
  MESSAGE: '.toast.animated.bounceIn',
};

export default locators;
