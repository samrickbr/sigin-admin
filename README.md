# SIGIN Admin Frontend

Frontend Administrativo do SIGIN.

Aplicação responsável pela interface administrativa do ERP SIGIN, construída seguindo a arquitetura definida pelo Roadmap Frontend e respeitando as decisões arquiteturais do Core.

---

## Stack

* React
* Vite
* TypeScript
* Material UI
* React Router
* React Query
* Zustand
* Axios
* React Hook Form
* Zod

---

## Arquitetura

Estrutura principal:

```text
src
├── app
│   ├── providers
│   └── router
├── auth
│   ├── api
│   ├── hooks
│   ├── pages
│   ├── services
│   ├── store
│   └── types
├── components
│   ├── common
│   ├── forms
│   ├── layout
│   └── table
├── guards
├── modules
│   ├── categorias
│   ├── canais-venda
│   ├── dashboard
│   ├── perfis
│   ├── pessoas
│   ├── produtos
│   └── usuarios
├── services
├── styles
├── types
└── utils
```

A estrutura é modular e permite a evolução independente das funcionalidades administrativas.

---

## Execução

Instalar dependências:

```bash
npm install
```

Executar ambiente de desenvolvimento:

```bash
npm run dev
```

Aplicação:

```text
http://localhost:5173
```

---

## Autenticação

O sistema utiliza autenticação JWT fornecida pelo Core.

Fluxo:

```text
Login
 ↓
Core API
 ↓
JWT
 ↓
persistência da sessão
 ↓
GET /auth/me
 ↓
identidade + perfis + permissões
 ↓
AuthStore
 ↓
AuthGuard / PermissionGuard
 ↓
rotas administrativas
```

O token é aplicado automaticamente nas requisições através do interceptor do Axios.

A identidade autenticada é carregada através do contrato `GET /auth/me` disponibilizado pelo Core.

---

## Design System

O Frontend utiliza Material UI com Dark Theme e tokens visuais centralizados em:

```text
src/styles
```

Componentes compartilhados atualmente incluem:

* Loading;
* EmptyState;
* Feedback;
* ConfirmDialog;
* DataTable;
* FormError.

Os componentes compartilhados devem ser reutilizados pelos módulos administrativos.

---

## Padrões do Projeto

* Priorizar reutilização antes de criação.
* Não duplicar componentes existentes.
* Respeitar decisões arquiteturais do Core.
* Frontend não contém regras de negócio.
* Módulos consomem exclusivamente APIs disponibilizadas pelo Core.
* Evoluir implementações existentes antes de substituí-las.
* Utilizar `sx` para propriedades visuais e de layout dos componentes MUI.
* Não criar contratos de API por suposição.

---

## Módulos Administrativos

### Categorias

Status: Concluído na F05.

Funcionalidades:

* Listagem.
* Cadastro.
* Edição.
* Ativação.
* Inativação.

### Canais de Venda

Status: Concluído na F05.

Funcionalidades implementadas conforme o contrato disponibilizado pelo Core:

* Listagem.
* Cadastro.
* Edição.
* Exclusão.
* Atualização.
* Feedback das operações.

### Produtos

Status: Concluído na F05.

O Produto permanece como cadastro central e único.

A relação com Categoria utiliza `categoriaId`.

A disponibilidade do Produto por CanalVenda é representada por `ProdutoCanal`.

`ProdutoVenda` permanece como conceito existente no Core, mas não é utilizado pelo Front como mecanismo de seleção ou disponibilidade de canais.

---

## Sprints

### F01 — Fundação do Backoffice Administrativo

Status: Concluída.

Principais entregas:

* Estrutura inicial do projeto.
* Layout administrativo.
* Autenticação JWT.
* Proteção de rotas.
* Axios.
* React Query.
* Zustand.
* Material UI Theme Dark.
* Base de permissões.

### F02 — Design System + Componentes Base

Status: Concluída.

Principais entregas:

* Theme consolidado.
* Tokens visuais.
* Componentes compartilhados.
* DataTable.
* FormError.
* Estados de loading, vazio e erro.
* Dialog de confirmação.

### F03 — Dashboard Administrativo

Status: Concluída.

Principais entregas:

* Dashboard.
* Cards de indicadores.
* Camada de serviço.
* Hook com React Query.
* Estados de interface.
* Integração com o layout administrativo.

### F04 — IAM e Autenticação do Front

Status: Concluída.

Principais entregas:

* Integração com `GET /auth/me`.
* Identidade autenticada.
* Restauração da sessão.
* Perfis.
* Permissões.
* AuthGuard.
* PermissionGuard.

### F05 — Produtos, Categorias e Canais de Venda

Status: Concluída.

Principais entregas:

* Administração de Produtos.
* Administração de Categorias.
* Administração de Canais de Venda.
* Integração Produto × Categoria.
* Integração Produto × CanalVenda.
* Disponibilidade de Produto por CanalVenda.

---

## Roadmap

O planejamento das próximas Sprints é definido pelo Roadmap Frontend.

As evoluções devem considerar o estado real do projeto e evitar duplicação de funcionalidades já implementadas.

O Frontend permanece desacoplado das regras de negócio e segue as decisões arquiteturais estabelecidas pelo Roadmap do Core.

---

## Documentação

A documentação oficial do projeto está em:

```text
docs/
```

Principais documentos:

* `00-estrutura-atual.md`
* `01-roadmap-front.md`
* `02-decisao-arquitetural-roadmap-frontend.md`
* `03-sprints.md`
* `04-regras-para-sprints.md`
* `05-design-system.md`
* `06-decisoes-tecnicas.md`
* `07-fluxo-execucao-sprints.md`

O histórico de versões está registrado no changelog do projeto.

---

## Estado Atual

**Versão: 0.5.0-front**

**Sprint F05 — Concluída.**

O Frontend Administrativo possui atualmente a fundação técnica, autenticação e autorização, Design System, Dashboard, Pessoas/infraestrutura relacionada, Produtos, Categorias e Canais de Venda conforme as funcionalidades efetivamente implementadas e documentadas.

As próximas evoluções dependem de definição do Roadmap Frontend.
