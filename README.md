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

---

## Arquitetura

Estrutura principal:

```
src
├── app
│   ├── providers
│   └── router
├── auth
│   ├── hooks
│   ├── pages
│   ├── services
│   └── store
├── components
│   └── layout
├── guards
├── modules
├── services
├── styles
├── types
└── utils
```

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

```
http://localhost:5173
```

---

## Autenticação

O sistema utiliza autenticação JWT fornecida pelo Core.

Fluxo:

```
Login
 ↓
Core API
 ↓
JWT
 ↓
Zustand Store
 ↓
Rotas protegidas
```

O token é aplicado automaticamente nas requisições através do Axios interceptor.

---

## Padrões do Projeto

* Priorizar reutilização antes de criação.
* Não duplicar componentes existentes.
* Respeitar decisões arquiteturais do Core.
* Frontend não contém regras de negócio.
* Módulos devem consumir exclusivamente APIs disponibilizadas pelo Core.

---

## Sprints

### F01 — Fundação do Backoffice Administrativo

Status: Concluída.

Entregas:

* Estrutura inicial do projeto.
* Layout administrativo.
* Autenticação JWT.
* Proteção de rotas.
* Axios.
* React Query.
* Zustand.
* Material UI Theme Dark.
* Base de permissões.

---

## Roadmap

Próximas evoluções:

* Design System.
* Dashboard Administrativo.
* Módulo Pessoas.
* Módulo Produtos.
* IAM Administrativo.
* Configurações.
