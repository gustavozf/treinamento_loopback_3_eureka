"use strict";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
const telefoneRegex = /^\(\d{2}\)\s9?\d{4}\-\d{4}$/;

module.exports = function(Cliente) {
  Cliente.validatesFormatOf("telefone", {
    with: telefoneRegex,
    message: "Formato de telefone inválido"
  });
  Cliente.validatesFormatOf("cpf", {
    with: cpfRegex,
    message: "Formato de cpf inválido"
  });

  Cliente.validatesUniquenessOf('cpf');
};
