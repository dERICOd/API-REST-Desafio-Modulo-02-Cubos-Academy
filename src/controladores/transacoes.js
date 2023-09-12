let { contas, saques, depositos, transferencias } = require('../bancodedados');
let tempoFormatado;

function getDate() {
  const data = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString()

  return `${data} ${hora}`
}

tempoFormatado = new Date().toLocaleString().split(',').join('')

const depositarNaConta = (req, res) => {
  const { numero_conta, valor } = req.body;

  const contaParaDepositar = contas.findIndex((conta) => {
    return conta.numero === Number(numero_conta);
  });

  contas[contaParaDepositar].saldo = contas[contaParaDepositar].saldo + valor;

  depositos.push({ data: tempoFormatado, numero_conta, valor });
  return res.status(204).send();
}

const sacarDaConta = (req, res) => {
  const { numero_conta, valor } = req.body;

  const contaParaSaque = contas.findIndex((conta) => {
    return conta.numero === Number(numero_conta);
  });

  contas[contaParaSaque].saldo = contas[contaParaSaque].saldo - valor;

  saques.push({ data: tempoFormatado, numero_conta, valor });
  return res.status(204).send();
}

const transferenciaDeConta = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  const contaOrigem = contas.findIndex((conta) => {
    return conta.numero === Number(numero_conta_origem);
  });

  if (contas[contaOrigem].saldo <= 0 || valor > contas[contaOrigem].saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente para realizar transferencia!" });
  }

  contas[contaOrigem].saldo = contas[contaOrigem].saldo - valor;

  const contaDestino = contas.findIndex((conta) => {
    return conta.numero === Number(numero_conta_destino);
  });
  contas[contaDestino].saldo = contas[contaDestino].saldo + valor;

  transferencias.push({ data: tempoFormatado, numero_conta_origem, numero_conta_destino, valor });
  return res.status(204).send();
}

const saldoDaConta = (req, res) => {
  const { numero_conta, senha } = req.query;

  const contaEncontrada = contas.find((conta) => {
    return conta.numero === +numero_conta;
  });

  return res.status(200).json({ saldo: contaEncontrada.saldo });
}

const extratoDaConta = (req, res) => {
  const { numero_conta, senha } = req.query;

  const depositosEncontrados = depositos.filter((elemento) => {
    return elemento.numero_conta === numero_conta;
  });

  const saquesEncontrados = saques.filter((elemento) => {
    return elemento.numero_conta === numero_conta;
  });

  const enviados = transferencias.filter((elemento) => {
    return elemento.numero_conta_origem === numero_conta;
  });

  const recebidos = transferencias.filter((elemento) => {
    return elemento.numero_conta_destino === numero_conta;
  });

  return res.status(200).json({
    depositos: [...depositosEncontrados],
    saques: [...saquesEncontrados],
    transacoesEnviadas: [...enviados],
    transacoesRecebidas: [...recebidos]
  });
}

module.exports = {
  depositarNaConta,
  sacarDaConta,
  transferenciaDeConta,
  saldoDaConta,
  extratoDaConta
}
