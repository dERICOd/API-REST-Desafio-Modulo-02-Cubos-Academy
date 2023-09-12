let { contas } = require('../bancodedados');
let numeroNovaContaCriada = 1;

const listarContas = (req, res) => {
  return res.status(200).json(contas);
}

const criarContas = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const novaConta = {
    numero: numeroNovaContaCriada,
    saldo: 0,
    usuario: {
      nome: nome,
      cpf: cpf,
      data_nascimento: data_nascimento,
      telefone: telefone,
      email: email,
      senha: senha
    }
  }
  contas.push(novaConta);
  numeroNovaContaCriada++;

  return res.status(204).send();
}

const atualizarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  })

  if (!conta) {
    return res.status(400).json({ mensagem: 'Conta não encontrada' });
  }

  let indexConta = contas.findIndex((indexConta) => {
    return conta.numero >= 0;
  });

  let contaAtualizada;

  if (conta) {
    contaAtualizada = {
      numero: Number(conta.numero),
      saldo: conta.saldo,
      usuario: {
        nome: nome,
        cpf: cpf,
        data_nascimento: data_nascimento,
        telefone: telefone,
        email: email,
        senha: senha
      }
    }

    const novaLista = contas.splice(indexConta, 1, contaAtualizada)
    return res.status(204).send()
  }
}

const excluirConta = (req, res) => {
  const { numeroConta } = req.params;

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  })

  if (!conta) {
    return res.status(400).json({ mensagem: 'Conta não encontrada' });
  }

  if (conta.saldo !== 0) {
    return res.status(403).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
  }

  contas = contas.filter((conta) => {
    return conta.numero !== Number(numeroConta);
  })
  return res.status(200).send();
}

module.exports = {
  listarContas,
  criarContas,
  atualizarConta,
  excluirConta
}
