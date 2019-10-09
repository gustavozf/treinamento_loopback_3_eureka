"use strict";

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
const telefoneRegex = /^\(\d{2}\)\s9?\d{4}\-\d{4}$/;

module.exports = function(Lojista) {
  Lojista.validatesFormatOf("telefone", {
    with: telefoneRegex,
    message: "Formato de telefone inválido"
  });
  Lojista.validatesFormatOf("cnpj", {
    with: cnpjRegex,
    message: "Formato de cnpj inválido"
  });

  Lojista.validatesUniquenessOf('cnpj');
};
