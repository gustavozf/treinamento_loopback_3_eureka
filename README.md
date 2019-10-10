# Treinamento - Loopback 3

## Apresentação
Introdução ao framework Loopback 3. 
"Como criar um projeto  e  ter uma api REST completa em poucos passos".

Material desenvolvido para realização do treinamento em Loopback 3 na Eureka Labs (10/10/2019).

### O que é?
O framework Loopback é um conjunto de módulos Node.js, os quais podem ser usados de forma independente ou conjunta para construir REST APIs de forma **rápida**. 

### Pros
- Desenvolvimento rápido
- Modelos e recursos integrados
- Recursos de acesso e usuário 
- Código modular e estruturado
- [Outros](http://voidcanvas.com/loopback-pros-and-cons/)

### Programa
0. Instalação
1. Criação de um Projeto
2. Modelos Padrões
3. Criação de um datasource
4. Criação de Modelos 
5. Validação de Modelos
6. Relações entre Modelos
7. Criação de Roles
8. ACLs
9. Remote Methods
10. Hooks

## Início

### Instalação
Para [instalar](https://loopback.io/doc/en/lb3/Installation.html#install-loopback-cli-tool) o Loopback *command-line interface (CLI) tool*, é necessário inserir o comando:
```
npm install -g loopback-cli
```

Dessa forma o comando **lb** estará disponível para ser utilizado, como:
```
lb -h
```
### Criação de Projeto
É possível criar um projeto por meio do comando:
```
lb NOME_DO_PROJETO
```
### Modelos Padrões
Ao ser criado um novo projeto, o Loopback dispõe de alguns [modelos base](https://loopback.io/doc/en/lb3/Using-built-in-models.html). Sendo eles:
- **Application Model**: possui *metadata* para aplicações clientes;
- **User model**: utilizado para realizar o registro e autenticação de usuários;
- **Access control models**: conjunto de modelos (ACL, AccessToken, Scope, Role e RoleMapping) que controlam o acesso à aplicação, recursos e métodos.

Além disso, por esses estenderem a classe *PersistedModel*, nativamente realizam operações CRUD.

## Criação de um Datasource
Um [*datasource*](https://loopback.io/doc/en/lb3/Defining-data-sources.html) no LoopBack, representa sistemas *backend*, como: bases de dados (databases), REST APIs externas, serviços de armazenamento, etc. Provê operações de CRUD (*create*, *retrieve*, *update* e *delete*).

Antes de inserir um novo datasource, caso tenha *docker-compose* instalado, salve em um arquivo '.yml' as informações:
```
version: '3.3'
services:
    agroturbo-api-db:
        container_name: padoca-api-db
        image: postgres:10.5-alpine
        environment:
          -  "POSTGRES_DB=padoca"
          -  "POSTGRES_USER=root"
          -  "POSTGRES_PASSWORD=root"
        ports:
          - 5432:5432
```

E execute o comando:
```
docker-compose -f arquivo.yml up -d
```

Logo em seguida, para criar um novo *datasource*, usa-se o comando:
```
lb datasource
```

e insira as informações:
```
? Insira o nome da origem de dados: padoca
? Selecione o conector para padoca: PostgreSQL (suportado por StrongLoop)
? Connection String url to override other settings (eg: postgres://username:password@localhost/database): 
? host: localhost
? port: 5432
? user: root
? password: root
? database: padoca
? Instalar loopback-connector-postgresql@^3.4.0: Y
```

### Migração dos Modelos
Para [migrar](https://loopback.io/doc/en/lb3/Implementing-auto-migration.html) os modelos para o BD, é possível utilizar funções prontas do Loopback, como:
- **automigrate**: Derruba os objetos do BD, se existentes, e os recria tendo como base as definições de modelos. Logo, os dados existentes serão perdidos; 
- **autoupdate**: Altera os objetos do BD, tendo como base as diferenças perceptíveis dos modelos definidos e dos objetos existentes. Mantém os dados existentes. 

Para criar tabelas no *datasource* recém criado, tendo em base os modelos existentes até então, insira o seguinte código em um arquivo ".js" na pasta */server/boot*:
```
const lbTables = [
  "User",
  "AccessToken",
  "ACL",
  "RoleMapping",
  "Role"
];

module.exports = function(app) {
  if (lbTables) {
    app.dataSources.padoca.autoupdate(lbTables, function(err) {
      if (err) throw err;

      console.log("Models created!\n");
    });
  }
};

```

Altere o campo "dataSource" dos modelos no arquivo "server/model-config.json" de *db* para *padoca*. Como: 
```
"User": {
  "dataSource": "padoca"
}
```

Ressalta-se que estes métodos podem vir a gerar complicações futuras. Logo, em um problema real, o ideal seria utilizar *frameworks* externos, como o [db-migrate](https://db-migrate.readthedocs.io/en/latest/).

## Criação de Modelos
Pra criar [modelos](https://loopback.io/doc/en/lb3/Using-the-model-generator.html), use o comando:
```
lb model NOME_MODELO
```

Para o sistema que está sendo desenvolvido, serão criados dois modelos:
- Lojista
```
---------------------
| Lojista           |
---------------------
| nome : string     |
| telefone : string |
| cnpj : string      |
| endereço : string |
---------------------
```

- Produto
```
-----------------------
| Produto             |
-----------------------
| nome : string       | 
| preço : number      | 
| marca : string      | 
| quantidade : number |
| categoria : string  |
-----------------------
```

- Cliente
```
---------------------
| Lojista           |
---------------------
| nome : string     |
| telefone : string |
| cpf : string      |
| endereço : string |
---------------------
```


Obs.: Lembrar de adicionar os modelos ao *server/boot/migration.js*

### Filtros
Utilizados para [filtrar](https://loopback.io/doc/en/lb3/Querying-data.html) a pesquisa de modelos.
- [where](https://loopback.io/doc/en/lb3/Where-filter.html): especifica um critério de busca;
- [fields](https://loopback.io/doc/en/lb3/Fields-filter.html): especifica os campos do modelo que deverão ser incluídos/excluídos;
- [include](https://loopback.io/doc/en/lb3/Include-filter.html): inclui nos resultados modelos relacionados;
- [limit](https://loopback.io/doc/en/lb3/Limit-filter.html): limita o número de instâncias retornadas;
- [order](https://loopback.io/doc/en/lb3/Order-filter.html): especifica um determinado critério de ordem (ASC ou DSC).

Exemplos:
- JS
```
Lojista.find({where: {nome: "Pedro"}, limit: 3})
```

- REST
```
(GET) /Lojistas?filter[where][nome]=Pedro&filter[limit]=3
```

### Validação de Modelos
É possível [validar](https://loopback.io/doc/en/lb3/Validating-model-data.html) os modelos inseridos, por meio das funções:
- **validatesUniquenessOf**: garante a unicidade de uma determinada propriedade do modelo;
- **validatesFormatOf**: valida o formato de uma determinada propriedade do modelo;
- **validatesPresenceOf**: valida a presença de uma ou mais propriedades do modelo;
- **validatesAbsenceOf**: valida a ausência de uma ou mais propriedades do modelo;
- **validatesInclusionOf**: verifica se o valor de uma propriedade está dentre um conjunto de valores;
- **validatesExclusionOf**:  verifica se o valor de uma propriedade não está dentre um conjunto de valores;
- **validatesLengthOf**: valida o comprimento de uma determinada propriedade. Podendo ser especificados os valores mínimo (*min*), máximo (*max*) e equivalente (*is*);
- **validatesNumericalityOf**: verifica se uma propriedade possui valor numérico;
- **validatesDateOf**: verifica se uma propriedade é do tipo *Date*;

Exemplo, supondo um arquivo *common/models/user.js*:
```
module.exports = function(user) {
  user.validatesPresenceOf('name', 'email');
  user.validatesLengthOf('password', {min: 5, message: {min: 'Password is too short'}});
  user.validatesInclusionOf('gender', {in: ['male', 'female']});
  user.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
  user.validatesNumericalityOf('age', {int: true});
  user.validatesUniquenessOf('email', {message: 'email is not unique'});
};
```

Também é possível realizar validações customizadas:
```
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
```

Regexes auxíliares:
```
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
const telefoneRegex = /^\(\d{2}\)\s9?\d{4}\-\d{4}$/;
```

Exemplos de CPF:
- 101.316.920-46
- 841.650.500-40
- 492.354.920-33

Exemplos de CNPJ:
- 95.007.326/0001-57
- 77.939.297/0001-80
- 26.214.367/0001-00

## Relações entre Modelos
Para relacionar dois modelos, usa-se o comando:
```
lb relation
```

Estão disponíveis os tipos de [relacionamentos](https://loopback.io/doc/en/lb3/Creating-model-relations.html):
- [BelongsTo](https://loopback.io/doc/en/lb3/BelongsTo-relations.html);
- [HasOne](https://loopback.io/doc/en/lb3/HasOne-relations.html);
- [HasMany](https://loopback.io/doc/en/lb3/HasMany-relations.html);
- [HasAndBelongsToMany](https://loopback.io/doc/en/lb3/HasAndBelongsToMany-relations.html);
- etc.

## Modelos de Controle de Acesso
### Roles
É possível definir dois tipos de [Roles](https://loopback.io/doc/en/lb3/Defining-and-using-roles.html):
- **Estáticos**: aqueles que são armazenados em um *data source* e são mapeados aos usuários;
- **Dinâmicos**: não são designados aos usuários e são determinados durante o acesso.

O Loopback possui três tipos de roles dinâmicos:
- **$owner**: dono do objeto;
- **$authenticated**: usuários autenticados;
- **$unauthenticated**: usuários não autenticados; 
- **$everyone**: todos.

### RoleMapping
Mapeia roles estáticos à IDs de usuários. Estrutura de criação:

```
RoleMapping.create(
  {
    principalType: RoleMapping.USER,
    principalId: ID_USUARIO,
    roleId: ID_ROLE
  }
);
```

### Access Control Lists (ACLs)
Controlam a autorização de acesso do usuários para partes específicas de um determinado modelo. Para que isso seja realizado, são utilizados dos roles (estáticos e dinâmicos). Podendo ser mapeados conjuntos de operações (definidos de acordo com o tipo de acesso) ou operações específicas.

Dessa forma, as [ACLs](https://loopback.io/doc/en/lb3/Controlling-data-access.html) podem mapear os tipos de acesso: 
- READ: exists, findById, find, findOne, count;
- WRITE: create, updateAttribute, upsert (update or insert), destroyById;
- EXECUTE: qualquer outro tipo de método, incluindo métodos customizados.

Para criar uma nova ACL, utiliza-se o comando:
```
lb acl
```

Exemplos:
```
{
  "accessType": "*",
  "principalType": "ROLE",
  "principalId": "$everyone",
  "permission": "DENY"
},
{
  "accessType": "*",
  "principalType": "ROLE",
  "principalId": "$authenticated",
  "permission": "ALLOW"
},
{
  "accessType": "WRITE",
  "principalType": "ROLE",
  "principalId": "$everyone",
  "permission": "ALLOW",
  "property": "create"
}
```
## Remote Methods
Um [remote method](https://loopback.io/doc/en/lb3/Remote-methods.html), é um método de um modelo disponível por um *endpoint* customizado. É utilizado para o desenvolvimento de operações não providas pelo Loopback.

Para a criação destas, é necessário:
- Desenvolver uma função no arquivo *.js* correspondente do modelo;
- Registrar o *remote method*. Sendo possível que isso seja realizado tanto no arquivo JSON quanto no arquivo *.js* de um modelo.

Para expor uma função por meio de um *remote method*, como uma função JS:
```
MODELO.remoteMethod('nome_da_funcao', {
  accepts: {arg: 'nome_argumento', type: 'tipo', required: boolean},
  returns: {arg: 'objeto_retorno', type: 'tipo'},
  http: {path: "endpoint", verb: "post/get/etc"}
});
```
Opcionalmene, é possível passar um argumento pelo corpo da requisição *http*
```
http: { source: "body" }
```

É possível também passar um informação pelo próprio *endpoint*, como:
```
accepts: {arg: "id", type: "number", required: true},
returns: {arg: "createdObjs", type: "Object"},
http: { path: "/:id/endpoint", verb: "post" }
```

Para facilitar a manipilação dos dados, é possível criar [transações](https://loopback.io/doc/en/lb3/Using-database-transactions.html).
```
app.dataSources.MEU_DATASOURCE.transactions(FUNCAO_EXECUCAO, OPCOES, CALLBACK_ERROR)
```

## Operation Hooks
[Operation Hooks](https://loopback.io/doc/en/lb3/Operation-hooks.html) são operações executadas antes ou após a chamada de um determinado conjunto de métodos. 

No arquivo *.js* de um determinado modelo, deve ser definida a função:
```
MODELO.observe(NOME, function(ctx, next){
  ...
  next();
});
```

ou na versão usando *async/await*
```
MODELO.observe(NOME, async function(ctx){
  ...
  return;
});
```

Ressalta-se que *nome* representa uma dentre as opções:
- access
- before save
- after save
- before delete
- after delete
- loaded
- persist
