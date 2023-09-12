const express = require('express');
const roteador = require('./roteador.js');

const servidor = express();

servidor.use(express.json());
servidor.use(roteador);

servidor.listen(3000);
