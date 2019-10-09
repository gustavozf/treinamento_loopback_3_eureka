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
6. Criação de Roles
7. Relações entre Modelos
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
| Nome : string     |
| Telefone : string |
| Endereço : string |
---------------------
```

- Produto
```
-----------------------
| Produto             |
-----------------------
| Nome : string       | 
| Preço : number      | 
| Marca : string      | 
| Quantidade : number |
| Categoria : string  |
-----------------------
```

### Filtros
É possível filtrar a pesquisa de modelos