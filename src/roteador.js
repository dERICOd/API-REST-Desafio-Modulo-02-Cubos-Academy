const express = require('express');
const { listarContas, criarContas, excluirConta, atualizarConta } = require('./controladores/contas');
const { depositarNaConta, sacarDaConta, transferenciaDeConta, saldoDaConta, extratoDaConta } = require('./controladores/transacoes');
const { validacaoCpf, validacaoEmail, verificacaoCamposPreenchidos, validacaoDeSenha, validacaoParaDeposito, validarSaque, validarConsulta, validarTransferencia, validacaoEmailAtualizarConta, validacaoCpfAtualizarConta } = require('./intermediarios.js');

const rotas = express();

rotas.get('/contas', validacaoDeSenha, listarContas);
rotas.post('/contas', verificacaoCamposPreenchidos, validacaoCpf, validacaoEmail, criarContas);
rotas.put('/contas/:numeroConta/usuario', verificacaoCamposPreenchidos, validacaoCpfAtualizarConta, validacaoEmailAtualizarConta, atualizarConta);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', validacaoParaDeposito, depositarNaConta);
rotas.post('/transacoes/sacar', validarSaque, sacarDaConta);
rotas.post('/transacoes/transferir', validarTransferencia, transferenciaDeConta);
rotas.get('/contas/saldo', validarConsulta, saldoDaConta);
rotas.get('/contas/extrato', validarConsulta, extratoDaConta);

module.exports = rotas;
