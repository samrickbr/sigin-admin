# Roadmap Frontend — SIGIN

## Objetivo

Este documento define a arquitetura, diretrizes e evolução do Frontend Administrativo do SIGIN.

O Roadmap Frontend é responsável exclusivamente pelas decisões relacionadas à interface, experiência do usuário e arquitetura React.

As regras de negócio, modelo de domínio e arquitetura do ERP permanecem sob responsabilidade do Roadmap do Core.

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

Testes

↓

Documentação

↓

Commit / Tag

↓

Feedback

↓

Roadmap Frontend

Caso seja identificada alguma limitação arquitetural do Core, esta deverá ser registrada como feedback para o Roadmap do Core, não sendo permitidas alterações estruturais durante a Sprint Frontend.

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

É vedado durante as Sprints:

* recriar componentes existentes;
* substituir implementações apenas por preferência técnica;
* alterar padrões definidos neste Roadmap sem aprovação;
* criar regras de negócio no Frontend;
* inventar contratos ou endpoints do Core;
* criar abstrações paralelas para substituir conceitos existentes no Core.

Sempre priorizar evolução antes de substituição.

---

# Organização das Sprints

Cada Sprint Front deverá seguir obrigatoriamente o fluxo:

Planejamento

↓

Implementação

↓

Testes

↓

Documentação

↓

Commit

↓

Tag

↓

Feedback

↓

Atualização do Roadmap

---

# Estado atual do projeto

O Frontend Administrativo utiliza:

* React;
* Vite;
* TypeScript;
* React Router;
* Material UI;
* React Query;
* Zustand;
* Axios;
* React Hook Form;
* Zod.

A estrutura do projeto é modular e possui infraestrutura compartilhada para:

* autenticação;
* autorização;
* layout;
* navegação;
* componentes comuns;
* tabelas;
* formulários;
* serviços;
* gerenciamento de estado e cache.

O projeto possui atualmente módulos administrativos para funcionalidades já implementadas e em evolução, incluindo:

* Dashboard;
* Pessoas;
* Produtos;
* Categorias;
* Canais de Venda;
* Usuários;
* Perfis.

A estrutura real do projeto deve sempre prevalecer sobre documentação ou histórico quando houver divergência.

---

# Objetivo do Frontend

Construir o Backoffice Administrativo do SIGIN, que será utilizado pelos módulos:

* Core;
* Delivery;
* PDV;
* Comanda;
* Produção;
* Financeiro;
* demais módulos futuros.

O Backoffice representa o ERP como um todo, não um módulo específico.

---

# Arquitetura de Produto

O Produto permanece como cadastro central e unificado no Frontend.

Conceitualmente:

```text
Produto
├── dados gerais
├── categoria
├── preço padrão
├── disponibilidade geral
└── disponibilidade por CanalVenda
    └── ProdutoCanal
```

O Frontend deve respeitar os conceitos e contratos definidos pelo Core.

A disponibilidade de um Produto em determinado CanalVenda é representada por `ProdutoCanal`.

O Frontend não deve criar produtos específicos por módulo ou canal, nem criar abstrações paralelas para representar essa relação.

---

# Preço de Produto

O modelo de preços segue a arquitetura definida pelo Core:

* Produto possui um preço global/padrão;
* cada CanalVenda ou módulo que comercializa o Produto pode possuir seu próprio preço específico;
* a existência de preço associado à relação Produto × Canal é intencional.

O Frontend deve consumir e apresentar essa estrutura conforme os contratos reais disponibilizados pelo Core.

Qualquer dúvida ou inconsistência sobre a modelagem de preços deverá ser encaminhada ao Roadmap do Core antes de alterações no Frontend ou no Core.

---

# Produto × CanalVenda

A relação entre Produto e CanalVenda utiliza o conceito `ProdutoCanal`.

O modelo adotado pelo Frontend é:

```text
Produto
   ↓
CanalVenda
   ↓
ProdutoCanal
   ↓
disponibilidade do Produto naquele CanalVenda
```

O Frontend não deve utilizar `ProdutoVenda` como mecanismo de seleção ou disponibilidade dos canais do Produto.

Não devem ser criados conceitos paralelos como:

* ProdutoDelivery;
* ProdutoBalcão;
* ProdutoMarketplace;
* ProdutoModulo;
* ou equivalentes.

CanalVenda continua sendo o conceito utilizado para representar o contexto comercial disponibilizado pelo Core.

---

# Categoria

Categoria é utilizada pelo Produto como parte de seu cadastro.

O contrato atual de Produto disponibiliza `categoriaId` diretamente no `ProdutoResponse`.

Durante a edição de Produto, o Frontend deve utilizar diretamente esse identificador para preencher o campo de Categoria.

O Frontend não deve inferir o identificador da Categoria pelo nome.

A regra de negócio relacionada à unicidade ou validação de Categoria permanece sob responsabilidade do Core.

---

# Sprint F01 — Fundação do Backoffice Administrativo

Status:

**Concluída.**

Principais entregas:

* estrutura React + Vite + TypeScript;
* React Router;
* Providers;
* layout administrativo;
* Header;
* Sidebar;
* autenticação JWT;
* persistência de sessão;
* AuthGuard;
* Axios;
* React Query;
* Zustand;
* Material UI Theme.

---

# Sprint F02 — Design System + Componentes Base

Status:

**Concluída.**

Principais entregas:

* Theme consolidado;
* tokens visuais;
* overrides MUI;
* Loading;
* EmptyState;
* Feedback;
* ConfirmDialog;
* DataTable;
* FormError.

---

# Sprint F03 — Dashboard Administrativo

Status:

**Concluída.**

Principais entregas:

* Dashboard Administrativo;
* cards de indicadores;
* `DashboardIndicatorCard`;
* `dashboardService`;
* `useDashboard`;
* estados de loading, vazio e erro;
* integração com `MainLayout`;
* proteção por `AuthGuard`.

O Dashboard permanece preparado para futura integração com contratos oficiais do Core.

---

# Sprint F04 — IAM e Autenticação do Front

Status:

**Concluída.**

Objetivo:

Consolidar a autenticação do Frontend utilizando a infraestrutura existente e o contrato real `GET /auth/me`.

Principais entregas:

* integração com `/auth/me`;
* identidade autenticada;
* Pessoa vinculada;
* perfis;
* permissões;
* restauração da sessão;
* integração com `AuthStore`;
* integração com `AuthGuard`;
* integração com `PermissionGuard`;
* utilização das permissões reais retornadas pelo Core.

A Sprint não criou mecanismo paralelo de autenticação ou autorização.

---

# Sprint F05 — Produtos, Categorias e Canais de Venda

Status:

**Concluída.**

## Objetivo

Concluir a manutenção administrativa de:

* Produtos;
* Categorias;
* Canais de Venda.

Também foram consolidadas as integrações:

* Produto × Categoria;
* Produto × CanalVenda;
* disponibilidade de Produto por CanalVenda.

## Produtos

A manutenção de Produto foi preservada e evoluída somente quando necessário para os contratos atualizados do Core.

O Frontend mantém:

* cadastro;
* edição;
* listagem;
* busca;
* preço padrão;
* disponibilidade geral;
* categoria;
* seleção de Canais de Venda;
* integração Produto × Canal utilizando `ProdutoCanal`.

O `ProdutoResponse.categoriaId` é utilizado diretamente na edição do Produto.

## Categorias

Foi implementada a manutenção administrativa de Categoria, incluindo:

* listagem;
* cadastro;
* edição;
* ativação;
* inativação;
* feedback de operações;
* integração com Produto.

A ativação e inativação utilizam o `PUT` disponibilizado pelo Core.

Não existe exclusão física de Categoria pelo Front.

## Canais de Venda

Foi implementada a manutenção administrativa de CanalVenda, incluindo:

* listagem;
* cadastro;
* edição;
* exclusão;
* apresentação da situação;
* atualização da listagem;
* feedback das operações.

Os Canais de Venda administrados nesta área permanecem disponíveis para utilização na relação Produto × Canal.

## ProdutoVenda

`ProdutoVenda` permanece como conceito existente no Core, porém não é utilizado pelo Frontend como mecanismo de seleção ou disponibilidade de canais do Produto.

A antiga `ProdutoVendaPage` não faz parte do fluxo atual do Frontend.

As rotas relacionadas à antiga manutenção específica de ProdutoVenda também não fazem parte do fluxo atual.

---

# Estado arquitetural atual

Após a conclusão da F05, o Frontend possui como diretrizes consolidadas:

* Produto é cadastro central e unificado;
* Categoria integra o cadastro de Produto;
* Produto possui preço padrão;
* CanalVenda representa o contexto comercial;
* ProdutoCanal representa a disponibilidade do Produto por CanalVenda;
* ProdutoVenda não é utilizado pelo Front para seleção de canais;
* contratos e regras de negócio permanecem sob responsabilidade do Core;
* o Frontend consome os contratos reais disponibilizados pelo Core.

---

# Performance

Existe uma investigação separada relacionada à percepção de lentidão no carregamento do Frontend, incluindo pontos como bootstrap, Providers, Zustand, React Query, autenticação, `/auth/me`, MainLayout e Sidebar.

Essa investigação permanece separada das Sprints funcionais e não deve ser misturada à implementação de funcionalidades sem definição específica do Roadmap Frontend.

---

# Próximas Sprints

O planejamento das próximas Sprints permanece sujeito à análise do estado real do projeto e à definição do Roadmap Frontend.

Nenhuma Sprint deverá duplicar funcionalidades já implementadas.

Qualquer necessidade que envolva:

* contrato do Core;
* regra de negócio;
* arquitetura do domínio;
* alteração estrutural do Core;

deverá ser encaminhada ao Roadmap do Core antes da implementação.

---

# Governança

O Roadmap Frontend permanece responsável pelas decisões arquiteturais do Frontend.

O Roadmap Core permanece como autoridade máxima para:

* domínio;
* regras de negócio;
* arquitetura do ERP;
* banco de dados;
* contratos das APIs;
* segurança do Core.

As Sprints Frontend devem implementar somente decisões previamente estabelecidas.

---

# Status do documento

Documento atualizado após a conclusão da Sprint F05.

A documentação deve continuar refletindo o estado real do projeto, prevalecendo o código existente em caso de divergência.
