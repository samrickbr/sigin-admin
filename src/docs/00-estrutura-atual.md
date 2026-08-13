# Estrutura Atual — SIGIN Front

## Visão geral

O SIGIN Front Administrativo utiliza React, TypeScript e Vite, organizado por módulos funcionais, componentes compartilhados, autenticação, infraestrutura da aplicação e estilos.

A estrutura atual encontra-se organizada da seguinte forma:

```text
src/
├── App.css
├── App.tsx
├── index.css
├── main.tsx
│
├── app/
│   ├── providers/
│   │   └── AppProviders.tsx
│   └── router/
│       └── index.tsx
│
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
│
├── auth/
│   ├── api/
│   ├── hooks/
│   │   └── usePermission.ts
│   ├── pages/
│   │   └── LoginPage.tsx
│   ├── services/
│   │   └── authService.ts
│   ├── store/
│   │   ├── authStorage.ts
│   │   └── authStore.ts
│   └── types/
│       └── authMe.ts
│
├── components/
│   ├── common/
│   │   ├── ConfirmDialog/
│   │   ├── EmptyState/
│   │   ├── Feedback/
│   │   └── Loading/
│   ├── forms/
│   │   └── FormError/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   └── table/
│       └── DataTable/
│
├── docs/
│   ├── 00-estrutura-atual.md
│   ├── 01-roadmap-front.md
│   ├── 02-decisao-arquitetural-roadmap-frontend.md
│   ├── 03-sprints.md
│   ├── 04-regras-para-sprints.md
│   ├── 05-design-system.md
│   ├── 06-decisoes-tecnicas.md
│   ├── 07-fluxo-execucao-sprints.md
│   └── identidade-visual/
│
├── guards/
│   ├── AuthGuard.tsx
│   └── PermissionGuard.tsx
│
├── hooks/
│
├── modules/
│   ├── categorias/
│   ├── dashboard/
│   │   ├── components/
│   │   │   └── DashboardIndicatorCard.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   └── services/
│   │       └── dashboardService.ts
│   ├── perfis/
│   ├── pessoas/
│   ├── produtos/
│   │   ├── hooks/
│   │   │   └── useProdutos.ts
│   │   ├── pages/
│   │   │   └── ProdutosListPage.tsx
│   │   ├── services/
│   │   │   └── produtosService.ts
│   │   └── types/
│   │       └── produtos.ts
│   └── usuarios/
│
├── services/
│   ├── api.ts
│   └── queryClient.ts
│
├── styles/
│   ├── colors.ts
│   ├── index.ts
│   ├── radius.ts
│   ├── shadows.ts
│   ├── spacing.ts
│   ├── theme.ts
│   ├── ThemeProvider.tsx
│   ├── typography.ts
│   └── ...
│
├── types/
│
└── utils/
```

## Organização por responsabilidade

### `app/`

Contém a infraestrutura de inicialização da aplicação, incluindo Providers e configuração do React Router.

### `auth/`

Responsável pelo fluxo de autenticação, armazenamento da sessão, serviços de autenticação, informações do usuário autenticado e hooks relacionados a permissões.

### `components/`

Contém componentes compartilhados entre diferentes módulos do Backoffice.

Entre os componentes reutilizáveis estão:

* `DataTable`;
* `ConfirmDialog`;
* `EmptyState`;
* `Feedback`;
* `Loading`;
* `FormError`;
* `MainLayout`;
* `Header`;
* `Sidebar`.

### `guards/`

Contém as proteções de acesso utilizadas pelo Front:

* `AuthGuard`;
* `PermissionGuard`.

### `modules/`

Contém as funcionalidades de negócio do Backoffice, organizadas por domínio.

Os módulos atualmente presentes incluem:

* Categorias;
* Dashboard;
* Perfis;
* Pessoas;
* Produtos;
* Usuários.

Os módulos podem possuir suas próprias páginas, hooks, services, types e componentes específicos.

### `services/`

Contém infraestrutura compartilhada para comunicação e gerenciamento de dados:

* `api.ts` para comunicação HTTP;
* `queryClient.ts` para configuração do React Query.

### `styles/`

Contém o Design System e a configuração visual global da aplicação, incluindo tema, tipografia, espaçamentos, raios, sombras e demais tokens visuais.

### `docs/`

Contém a documentação do SIGIN Front, incluindo roadmap, decisões arquiteturais, histórico de Sprints, regras de execução, Design System, decisões técnicas e fluxo de execução.

## Estado atual após a F05

A F05 ampliou os módulos administrativos de Produtos, Categorias e Canais de Venda.

O módulo de Produtos permanece responsável pelo cadastro central do Produto e utiliza `ProdutoCanal` para representar a disponibilidade do Produto em cada `CanalVenda`.

O módulo de Categorias possui manutenção administrativa de categorias.

O módulo de Canais de Venda possui manutenção administrativa dos canais disponíveis para utilização comercial.

A estrutura funcional segue organizada por domínio, sem introdução de uma arquitetura paralela para Produto × Canal.

## Princípios estruturais

A organização atual deve preservar:

* separação por domínio funcional;
* reutilização de componentes compartilhados;
* reutilização da infraestrutura HTTP e React Query;
* separação entre infraestrutura e funcionalidades de negócio;
* integração com os contratos reais fornecidos pelo Core;
* ausência de regras de negócio duplicadas no Front;
* evolução incremental durante as Sprints.

A documentação desta estrutura representa o estado do Front ao encerramento da F05.
