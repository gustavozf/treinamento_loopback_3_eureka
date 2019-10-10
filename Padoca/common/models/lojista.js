"use strict";

const app = require("../../server/server");
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

  Lojista.validatesUniquenessOf("cnpj");

  /*
  {
    "username" : "",
    "password" : "",
    "email" : "",
    "nome" : "",
    "telefone" : "",
    "cnpj" : "",
    "endereco" : ""
  }
  */
  Lojista.cadastro = function(objCadastro, callback) {
    app.dataSources.padoca.transaction(
      async models => {
        const { User, Lojista, RoleMapping } = models;
        // Criar um novo User
        const createdUser = await User.create({ ...objCadastro });

        // Criar um novo Lojista
        const createdLojista = await Lojista.create({
          ...objCadastro,
          idUser: createdUser.id
        });

        // Relacionar o Lojista ao Role
        const createRoleMap = await RoleMapping.create({
          principalType: RoleMapping.USER,
          principalId: createdUser.id,
          roleId: 3
        });

        callback(null, {
          createdUser,
          createdLojista,
          createRoleMap
        });
      },
      null,
      err => {
        if (err) callback(new Error(err));
      }
    );
  };

  Lojista.remoteMethod("cadastro", {
    accepts: {
      arg: "objCadastro",
      type: "Object",
      required: true,
      http: { source: "body" }
    },
    returns: {
      arg: "createdObjs",
      type: "Object"
    },
    http: { path: "/cadastro", verb: "post" }
  });
};
