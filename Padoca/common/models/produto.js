"use strict";

module.exports = function(Produto) {
  Produto.validate(
    "quantidade",
    function(err) {
      if (this.quantidade < 1 || !Number.isInteger(this.quantidade)) err();
    },
    {
      message:
        "O valor referente a Quantidade necessita ser um inteiro maior que zero!"
    }
  );

  Produto.validate(
    "preco",
    function(err) {
      if (this.preco <= 0) err();
    },
    {
      message:
        "O valor referente ao preco necessita ser um inteiro maior que zero!"
    }
  );

  Produto.observe("access", async function(ctx) {
    console.log("Produto acessado!");
    return;
  });
};
