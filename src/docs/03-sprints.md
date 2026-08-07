# docs/03-sprints.md

# Sprints — Frontend Administrativo do SIGIN

Este documento registra o planejamento, andamento e histórico das Sprints do Frontend Administrativo do SIGIN.

As Sprints do Front possuem planejamento próprio, porém seguem obrigatoriamente as definições estabelecidas pelo Roadmap Frontend e respeitam integralmente as decisões arquiteturais do Roadmap do Core.

---

# Fluxo Oficial

Roadmap Front

↓

Sprint Front

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

Roadmap Front

---

# Regras Gerais

Toda Sprint deverá obrigatoriamente responder antes da implementação:

* O que já existe?
* O que pode ser reutilizado?
* O que precisa ser evoluído?
* O que realmente precisa ser criado?

É proibido durante uma Sprint:

* recriar componentes existentes;
* alterar decisões arquiteturais do Core;
* mover estruturas apenas por organização;
* substituir implementações por preferência técnica.

Sempre priorizar evolução antes de substituição.

---

# Sprint F01 — Fundação do Backoffice Administrativo

## Objetivo

Construir a infraestrutura inicial do Frontend Administrativo do SIGIN.

Esta Sprint estabelece a base técnica sobre a qual todas as demais funcionalidades serão desenvolvidas.

Não contempla implementação de regras de negócio.

---

## Escopo

### Fundação do Projeto

* Criar projeto React.
* Configurar Vite.
* Configurar TypeScript.
* Estruturar diretórios.
* Configurar dependências base.

### Arquitetura

* Definir estrutura modular.
* Configurar React Router.
* Preparar Providers.
* Configurar organização da aplicação.

### Layout

* Estrutura principal.
* Header.
* Menu lateral.
* Área de conteúdo.
* Layout reutilizável.

### Autenticação

* Integração com JWT.
* Persistência da sessão.
* Logout.
* Proteção de rotas.

### Infraestrutura

* Axios.
* React Query.
* Zustand.
* Theme Material UI.

---

## Critérios de Conclusão

Ao término da Sprint deverão existir:

* Projeto estruturado.
* Navegação funcional.
* Layout administrativo.
* Login integrado ao Core.
* Proteção de rotas.
* Base para os módulos administrativos.

---

## Status

Concluída.

---

## Entregas Realizadas

### Arquitetura

* Estrutura React + Vite + TypeScript consolidada.
* React Router configurado.
* Providers centralizados.
* Estrutura modular preparada para evolução dos módulos administrativos.

### Layout

* Layout administrativo implementado.
* Header criado.
* Sidebar criado.
* Área de conteúdo integrada.
* Estrutura preparada para refinamentos visuais futuros.

### Autenticação

* Login integrado com API do Core.
* Autenticação JWT implementada.
* Persistência de sessão via Zustand.
* Logout implementado.
* AuthGuard aplicado nas rotas administrativas.

### Infraestrutura

* Axios configurado com interceptor JWT.
* React Query configurado.
* Zustand configurado.
* Material UI Theme configurado.
* Tema padrão definido como Dark.

---

## Decisões e Observações

* O Frontend segue consumindo exclusivamente as APIs disponibilizadas pelo Core.
* O controle granular de permissões foi preparado através do PermissionGuard, porém depende da exposição de permissões pelo Core.
* O Core atualmente retorna o JWT no login. A evolução futura poderá utilizar endpoint de sessão (`/auth/me`) ou retorno de permissões no login.
* Refinamentos visuais do Layout (ícones, sidebar recolhível, ajustes de espaçamento e responsividade) foram postergados para uma sprint específica de Design System.

---

# Backlog Inicial

---

## Sprint F02 — Design System + Componentes Base

Status: Em andamento

Entregas:

- Theme consolidado
- Tokens visuais
- Component overrides MUI
- Loading
- EmptyState
- Feedback
- ConfirmDialog
- DataTable
- FormError

---

---

Sprint F03 — Dashboard Administrativo

Status: Concluída

Objetivo:

Implementar o Dashboard Administrativo inicial do SIGIN, integrando o Design System existente, criando a estrutura visual do painel e preparando a camada de consumo de indicadores.

---

Entregas Realizadas

Dashboard

- Página Dashboard Administrativo criada.
- Layout inicial implementado.
- Cards de indicadores criados.
- Componente reutilizável `DashboardIndicatorCard` criado.

Dados

- Estrutura `dashboardService` criada.
- Hook `useDashboard` implementado utilizando React Query.
- Dados temporários isolados na camada de serviço.
- Preparação realizada para futura integração com API oficial do Core.

Estados da Interface

- Loading integrado utilizando componente existente do Design System.
- EmptyState integrado para ausência de dados.
- Feedback integrado para erros de carregamento.

Integração

- Fluxo `/` → `/login` validado.
- Login → `/dashboard` validado.
- Dashboard renderizado dentro do `MainLayout`.
- AuthGuard validado.

---

Validações Realizadas

Build:

```

npm run build

---

Resultado:

Build de produção aprovado.

Lint:

Identificados erros existentes fora do escopo da Sprint:
auth/hooks/usePermission.ts
guards/PermissionGuard.tsx

Não foram alterados durante a Sprint.

Decisões e Observações

Não existe endpoint de Dashboard/KPIs disponível no Core atualmente.
O Dashboard utiliza dados temporários encapsulados no service.
A substituição futura pelo endpoint oficial deverá ocorrer somente na camada de serviço.
O login atual retorna somente JWT.
A exibição do usuário autenticado no Header depende de endpoint futuro de sessão (/auth/me ou equivalente).

---

## Sprint F04

Módulo Pessoas

* Listagem.
* Cadastro.
* Edição.
* Consulta.

---

## Sprint F05

Módulo Produtos

* Listagem.
* Cadastro.
* Categorias.
* ProdutoVenda.

---

## Sprint F06

IAM Administrativo

* Usuários.
* Perfis.
* Permissões.

---

## Sprint F07

Configurações

* Configurações gerais.
* Preferências.
* Parâmetros.

---

# Observações

A ordem das próximas Sprints poderá ser ajustada pelo Roadmap Frontend conforme a evolução do projeto.

Nenhuma Sprint poderá alterar decisões arquiteturais do Core sem aprovação do Roadmap Core.

Todas as evoluções do Frontend deverão permanecer desacopladas das regras de negócio, consumindo exclusivamente as APIs disponibilizadas pelo Core.
