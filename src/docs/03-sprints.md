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

# Sprint F02 — Design System + Componentes Base

## Status

Concluída.

## Entregas

* Theme consolidado.
* Tokens visuais.
* Component overrides MUI.
* Loading.
* EmptyState.
* Feedback.
* ConfirmDialog.
* DataTable.
* FormError.

---

# Sprint F03 — Dashboard Administrativo

## Status

Concluída.

## Objetivo

Implementar o Dashboard Administrativo inicial do SIGIN, integrando o Design System existente, criando a estrutura visual do painel e preparando a camada de consumo de indicadores.

---

## Entregas Realizadas

### Dashboard

* Página Dashboard Administrativo criada.
* Layout inicial implementado.
* Cards de indicadores criados.
* Componente reutilizável `DashboardIndicatorCard` criado.

### Dados

* Estrutura `dashboardService` criada.
* Hook `useDashboard` implementado utilizando React Query.
* Dados temporários isolados na camada de serviço.
* Preparação realizada para futura integração com API oficial do Core.

### Estados da Interface

* Loading integrado utilizando componente existente do Design System.
* EmptyState integrado para ausência de dados.
* Feedback integrado para erros de carregamento.

### Integração

* Fluxo `/` → `/login` validado.
* Login → `/dashboard` validado.
* Dashboard renderizado dentro do `MainLayout`.
* AuthGuard validado.

---

## Validações Realizadas

### Build

```text
npm run build
```

Resultado:

Build de produção aprovado.

### Lint

Foram identificados erros existentes em:

* `auth/hooks/usePermission.ts`
* `guards/PermissionGuard.tsx`

Esses pontos foram posteriormente tratados durante a Sprint F04.

---

## Decisões e Observações

Não existe endpoint de Dashboard/KPIs disponível no Core atualmente.

O Dashboard utiliza dados temporários encapsulados no service.

A substituição futura pelos endpoints oficiais deverá ocorrer somente na camada de serviço.

A Sprint F03 deixou como evolução futura o carregamento da identidade autenticada através de um contrato de sessão disponibilizado pelo Core.

---

# Sprint F04 — IAM e Autenticação do Front

## Objetivo

Consolidar a autenticação do Frontend Administrativo utilizando a infraestrutura existente da Sprint F01/F03 e integrar o contrato real `GET /auth/me` disponibilizado pelo SIGIN Core.

A Sprint não cria um novo mecanismo de autenticação.

---

## Escopo

### Identidade Autenticada

* Consumir `GET /auth/me`.
* Carregar usuário autenticado.
* Carregar Pessoa vinculada.
* Carregar perfis.
* Carregar permissões.

### Sessão

* Persistir o JWT utilizando a infraestrutura existente.
* Restaurar a identidade autenticada após recarregamento da aplicação.
* Encerrar a sessão quando a identidade não puder ser validada.

### Permissões

* Utilizar as permissões reais retornadas pelo Core.
* Integrar as permissões ao mecanismo existente de guards.
* Consolidar a verificação realizada pelo `usePermission`.

### Integração

* Manter o `AuthStore` existente.
* Manter o `AuthGuard` existente.
* Manter o `PermissionGuard` existente.
* Utilizar o cliente Axios existente.
* Não criar mecanismos paralelos.

---

## Status

Concluída.

---

## Entregas Realizadas

### Contrato `/auth/me`

Criada a tipagem:

```text
src/auth/types/authMe.ts
```

Representando o contrato real disponibilizado pelo Core:

* `AuthMeResponse`
* `PessoaResponse`
* `PerfilResponse`
* `PermissaoResponse`

### Serviço

Atualizado:

```text
src/auth/services/authService.ts
```

Com consumo de:

```text
GET /auth/me
```

### Auth Store

Atualizado:

```text
src/auth/store/authStore.ts
```

Com:

* identidade autenticada;
* `fetchMe()`;
* hidratação após login;
* restauração da sessão;
* persistência isolada do JWT.

### Login

Atualizado:

```text
src/auth/pages/LoginPage.tsx
```

O fluxo passou a realizar a hidratação da identidade após o login.

### Permissões

Atualizado:

```text
src/auth/hooks/usePermission.ts
```

A verificação passou a utilizar as permissões reais retornadas pelo Core.

### Guards

Atualizados:

```text
src/guards/AuthGuard.tsx
src/guards/PermissionGuard.tsx
```

O `AuthGuard` restaura a identidade autenticada e o `PermissionGuard` utiliza as permissões reais do usuário.

---

## Fluxo Validado

```text
POST /auth/login
        ↓
JWT
        ↓
persistência
        ↓
GET /auth/me
        ↓
identidade autenticada
        ↓
Auth Store
        ↓
perfis + permissões
        ↓
AuthGuard / PermissionGuard
        ↓
interface administrativa
```

---

## Validações Realizadas

### Login

```text
POST /auth/login
→ JWT recebido
```

Aprovado.

### Identidade

```text
GET /auth/me
→ HTTP 200
→ usuário autenticado
→ Pessoa
→ perfis
→ permissões
```

Aprovado.

### Restauração de sessão

```text
F5
↓
JWT persistido
↓
GET /auth/me
↓
identidade restaurada
```

Aprovado.

### Sessão inválida

O comportamento real do Core foi respeitado:

```text
403 Forbidden
```

A sessão é limpa e o usuário é direcionado para autenticação.

### Qualidade

```text
npm run lint
```

Resultado:

```text
0 erros
```

### Git

```text
git diff --check
```

Resultado:

```text
Nenhum problema de whitespace
```

---

## Fora do Escopo

Não foram realizados:

* novo mecanismo de autenticação;
* segundo Auth Store;
* alteração do JWT do Core;
* alteração do comportamento HTTP do Core;
* CRUD de Usuários;
* CRUD de Perfis;
* correção da infraestrutura OAuth2 do Core;
* refatorações arquiteturais não relacionadas à Sprint.

---

## Dependência do Core

A F04 utiliza o contrato real disponibilizado pelo Core:

```text
GET /auth/me
Authorization: Bearer <JWT>
```

O Core permanece responsável por:

* autenticação;
* autorização;
* identidade;
* perfis;
* permissões;
* regras de negócio.

O Front permanece responsável por:

* consumir os contratos;
* armazenar a sessão;
* apresentar a identidade;
* controlar a experiência de navegação.

---

# Backlog Posterior

As próximas Sprints permanecem sujeitas à definição e revisão do Roadmap Front.

O planejamento posterior deverá considerar o estado real do projeto após a conclusão da F04, evitando duplicação de funcionalidades já implementadas.

---

# Observações

A ordem das próximas Sprints poderá ser ajustada pelo Roadmap Front conforme a evolução do projeto.

Nenhuma Sprint poderá alterar decisões arquiteturais do Core sem aprovação do Roadmap Core.

Todas as evoluções do Frontend deverão permanecer desacopladas das regras de negócio, consumindo exclusivamente as APIs disponibilizadas pelo Core.
