let { contas } = require('./bancodedados');

const validacaoDeSenha = (req, res, next) => {
	const { senha_banco } = req.query;

	if (!senha_banco) {
		return res.status(401).json({ mensagem: 'A senha não foi informada!' });
	}
	if (senha_banco !== 'Cubos123Bank') {
		return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
	}
	next();
}

const validacaoCpf = (req, res, next) => {
	const { cpf } = req.body;

	const cpfOk = contas.find((item) => {
		return item.usuario.cpf === cpf;
	})
	if (cpfOk) {
		return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" });
	}
	next();
}

const validacaoEmail = (req, res, next) => {
	const { email } = req.body;

	const emailOk = contas.find((item) => {
		return item.usuario.email === email;
	})

	if (emailOk) {
		return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
	}
	next();
}

const validarConsulta = (req, res, next) => {
	const { numero_conta, senha } = req.query;

	const contaEncontrada = contas.find((conta) => {
		return conta.numero === +numero_conta;
	});

	if (!contaEncontrada || contaEncontrada.usuario.senha !== senha) {
		return res.status(401).json({ mensagem: 'O número ou a senha da conta está incorreta!' });
	}
	next();
}

const verificacaoCamposPreenchidos = (req, res, next) => {
	const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

	if (!nome) {
		return res.status(400).json({ mensagem: 'O nome é obrigatorio!' });
	}

	if (!cpf) {
		return res.status(400).json({ mensagem: 'O cpf é obrigatorio!' });
	}

	if (!data_nascimento) {
		return res.status(400).json({ mensagem: 'A data de nascimento é obrigatorio!' });
	}

	if (!telefone) {
		return res.status(400).json({ mensagem: 'O telefone é obrigatorio!' });
	}

	if (!email) {
		return res.status(400).json({ mensagem: 'O email é obrigatorio!' });
	}

	if (!senha) {
		return res.status(400).json({ mensagem: 'A senha é obrigatorio!' });
	}
	next();
}

const validacaoParaDeposito = (req, res, next) => {
	const { numero_conta, valor } = req.body;

	const contaNaoEncontrada = contas.find((item) => {
		return item.numero === +numero_conta;
	});

	if (!contaNaoEncontrada) {
		return res.status(400).json({ mensagem: "Conta não encontrada!" });
	}

	if (valor <= 0) {
		return res.status(400).json({ mensagem: 'O Valor para deposito deve ser maior que zero!' });
	}

	if (!numero_conta) {
		return res.status(400).json({ mensagem: 'O número da conta é obrigatório!' });
	}

	if (!valor) {
		return res.status(400).json({ mensagem: 'O valor é obrigatório!' });
	}
	next();
}

const validarSaque = (req, res, next) => {
	const { numero_conta, valor, senha } = req.body;

	const contaSaque = contas.find((item) => {
		return item.numero === +numero_conta;
	});

	if (!contaSaque || contaSaque.usuario.senha !== senha) {
		return res.status(401).json({ mensagem: 'O número ou a senha da conta está incorreto!' });
	}

	if (valor > contaSaque.saldo) {
		return res.status(400).json({ mensagem: "Saldo insuficiente para realizar saque!" });
	}

	if (!valor || !numero_conta || !senha) {
		return res.status(400).json({ mensagem: 'O número da conta, o valor e a senha são obrigatórios!' });
	}
	next();
}

const validarTransferencia = (req, res, next) => {
	const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

	const contaEnvio = contas.find((conta1) => {
		return conta1.numero === +numero_conta_origem;
	});

	const contaDestino = contas.find((conta2) => {
		return conta2.numero === +numero_conta_destino;
	});

	if (!contaDestino || !contaEnvio || contaEnvio.usuario.senha !== senha) {
		return res.status(401).json({ mensagem: 'A senha ou os números das contas estam incorretos!' });
	}

	if (!valor || !numero_conta_origem || !numero_conta_destino || !senha) {
		return res.status(400).json({ mensagem: 'O número da conta, o valor e a senha são obrigatórios!' });
	}

	if (numero_conta_origem === numero_conta_destino) {
		return res.status(400).json({ mensagem: 'O número da conta, de origem e destino tem que ser diferentes!' });
	}
	next();
}

const validacaoCpfAtualizarConta = (req, res, next) => {
	const { cpf } = req.body;
	const { numeroConta } = req.params;


	const cpfOk = contas.find((item) => {
		return item.usuario.cpf === cpf && item.numero !== +numeroConta;
	})
	if (cpfOk) {
		return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" });
	}
	next();
}

const validacaoEmailAtualizarConta = (req, res, next) => {
	const { email } = req.body;
	const { numeroConta } = req.params;

	const emailOk = contas.find((item) => {
		return item.usuario.email === email && item.numero !== +numeroConta;
	})

	if (emailOk) {
		return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
	}
	next();
}


module.exports = {
	validacaoDeSenha,
	validacaoCpf,
	validacaoEmail,
	validarConsulta,
	verificacaoCamposPreenchidos,
	validacaoParaDeposito,
	validarSaque,
	validarTransferencia,
	validacaoCpfAtualizarConta,
	validacaoEmailAtualizarConta
}
