# Roadmap Frontend — SIGIN

## Objetivo

Este documento define a arquitetura, as diretrizes e a evolução do Frontend Administrativo do SIGIN.

O Roadmap Frontend é responsável exclusivamente pelas decisões relacionadas à interface, experiência do usuário e arquitetura React.

As regras de negócio, o modelo de domínio e a arquitetura do ERP permanecem sob responsabilidade do Roadmap do Core.

---

# Hierarquia de decisão

Roadmap Core (Autoridade Máxima)

↓

Roadmap Frontend

↓

Sprint Frontend

↓

Implementação

↓

Validação

↓

Documentação

↓

Feedback

↓

Roadmap Frontend

Caso seja identificada alguma limitação, dúvida ou inconsistência arquitetural do Core, ela deverá ser registrada como feedback para o Roadmap do Core.

Não devem ser realizadas alterações estruturais no Core durante uma Sprint Frontend por iniciativa própria.

---

# Responsabilidades do Roadmap Frontend

Definir:

* Arquitetura React;
* Estrutura do projeto;
* Organização dos módulos;
* Navegação;
* Layout administrativo;
* Design System;
* Componentes reutilizáveis;
* Estratégia de autenticação;
* Estratégia de autorização;
* Consumo das APIs do Core;
* Experiência do usuário (UX);
* Interface (UI);
* Performance do Frontend.

Não definir:

* Regras de negócio;
* Estrutura do banco de dados;
* APIs do Core;
* Entidades do domínio;
* Alterações arquiteturais do Core.

---

# Princípios

Antes de qualquer implementação, responder obrigatoriamente:

1. O que já existe?
2. O que pode ser reutilizado?
3. O que precisa ser evoluído?
4. O que realmente precisa ser criado?

Durante as Sprints é vedado:

* recriar componentes existentes;
* substituir implementações apenas por preferência técnica;
* alterar padrões definidos neste Roadmap sem aprovação;
* criar regras de negócio no Frontend;
* inventar endpoints, contratos ou permissões;
* criar workarounds para substituir comportamentos ou contratos do Core.

Sempre priorizar evolução antes de substituição.

---

# Relação com o Core

O Core é a autoridade para:

* regras de negócio;
* modelo de domínio;
* contratos das APIs;
* arquitetura comercial;
* relacionamentos entre entidades;
* permissões e demais definições de negócio.

O Frontend deve consumir os contratos reais disponibilizados pelo Core.

Quando houver dúvida ou inconsistência sobre uma regra de negócio ou decisão arquitetural do Core, a questão deve ser encaminhada ao Roadmap do Core antes de qualquer implementação no Front.

O Front não deve criar uma interpretação própria para substituir uma decisão ainda não definida no Core.

---

# Produto, Categoria e Canal de Venda

O Frontend segue a arquitetura definida pelo Core para o cadastro comercial de produtos.

O Produto é tratado como cadastro central e único.

Conceitualmente:

```text
Produto
├── dados gerais
├── Categoria
├── preço padrão
├── disponibilidade geral
└── ProdutoCanal
     └── CanalVenda
```

A disponibilidade de um Produto em determinado CanalVenda é representada por `ProdutoCanal`.

O Front não cria produtos específicos por módulo ou canal.

Não fazem parte da arquitetura do Front conceitos paralelos como:

* ProdutoDelivery;
* ProdutoBalcão;
* ProdutoMarketplace;
* CanalModulo;
* ProdutoModulo.

`ProdutoVenda` permanece como conceito existente no Core, porém não é utilizado pelo Front como mecanismo de seleção ou disponibilidade do Produto por CanalVenda.

A seleção de canais realizada no cadastro de Produto utiliza `ProdutoCanal`.

---

# Categoria no Produto

O Front utiliza o identificador de categoria disponibilizado pelo contrato do Produto.

Quando um `ProdutoResponse` possuir `categoriaId`, esse valor deve ser utilizado diretamente para preencher o campo de Categoria durante a edição do Produto.

O Front não deve:

* inferir a categoria pelo nome;
* procurar o ID da categoria pelo nome;
* realizar chamadas adicionais apenas para descobrir o ID correspondente.

A regra de identificação e relacionamento permanece sob responsabilidade do Core.

---

# Organização das Sprints

Cada Sprint Front deverá seguir o fluxo:

Planejamento

↓

Implementação

↓

Validação

↓

Documentação

↓

Feedback

↓

Atualização do Roadmap

O versionamento por commit e tag ocorre somente quando explicitamente autorizado no encerramento da execução.

---

# Histórico atual

As Sprints Front já executadas consolidaram progressivamente:

* Fundação do Frontend;
* Design System;
* Dashboard;
* infraestrutura de autenticação e autorização;
* Backoffice administrativo;
* manutenção de Produtos;
* manutenção de Categorias;
* manutenção de Canais de Venda;
* integração Produto × Categoria;
* integração Produto × Canal.
* fluxo administrativo contextual Pessoa → Usuário;
* fluxo administrativo contextual Usuário → Perfil.

---

# Performance

Performance do Frontend permanece como responsabilidade do Roadmap Frontend.

Investigações de performance identificadas durante as Sprints devem ser tratadas separadamente quando não fizerem parte do escopo funcional da Sprint em execução.

A identificação de um possível problema de performance não autoriza refatorações fora do escopo da Sprint.

---

# Objetivo do Frontend

Construir o Backoffice Administrativo do SIGIN, utilizado para administrar o ERP como um todo e servir aos diferentes contextos e módulos do sistema, incluindo:

* Core;
* Delivery;
* PDV;
* Comanda;
* Produção;
* Financeiro;
* demais módulos futuros.

O Backoffice representa o ERP como um todo, e não um módulo específico.
