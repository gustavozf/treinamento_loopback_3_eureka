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
2. Criação de um datasource
3. Modelos Padrões
4. Criação de Roles
5. Criação de Modelos 
6. Validação de Modelos
6. Relações entre Modelos
7. ACLs
8. Remote Methods
9. Hooks

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

### Criação de um Datasource
Um [*datasource*](https://loopback.io/doc/en/lb3/Defining-data-sources.html) no LoopBack, representa sistemas *backend*, como: bases de dados (databases), REST APIs externas, serviços de armazenamento, etc. Provê operações de CRUD (*create*, *retrieve*, *update* e *delete*).

Para criar um novo *datasource*, usa-se o comando:
```
lb datasource
```

Insira as informações:
```
? Insira o nome da origem de dados: padoca-db
? Selecione o conector para padoca-db: PostgreSQL (suportado por StrongLoop)
? Connection String url to override other settings (eg: postgres://username:password@localhost/database): 
? host: localhost
? port: 5432
? user: root
? password: root
? database: padoca
? Instalar loopback-connector-postgresql@^3.4.0: Y
```

Caso tenha *docker-compose* instalado, salve em um arquivo '.yml' as informações:
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