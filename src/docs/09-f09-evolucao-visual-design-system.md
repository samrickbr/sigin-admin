# F09 — Evolução Visual / Design System

## Objetivo

Evoluir a interface visual do SIGIN Front Administrativo, tornando o sistema mais consistente, moderno e adequado à utilização como ERP administrativo.

A evolução visual deve preservar a arquitetura existente do Front e utilizar a infraestrutura tecnológica já adotada.

## Referência visual

A referência visual escolhida para a evolução do SIGIN é o Aurora Free.

O Aurora será utilizado como referência de linguagem visual, composição de layout, organização administrativa, componentes e experiência de uso.

O Aurora não deve se tornar uma dependência arquitetural obrigatória do SIGIN.

Quando possível, conceitos visuais e componentes serão reproduzidos utilizando a infraestrutura MUI já existente no projeto.

## Stack preservada

A F09 não altera a stack principal do Front:

- React
- Vite
- TypeScript
- Material UI
- React Router
- React Query
- Zustand
- React Hook Form
- Zod

## Temas

O SIGIN deverá possuir dois temas visuais:

- Light
- Dark

Os dois temas devem utilizar o mesmo Design System.

Não devem existir dois conjuntos independentes de componentes ou regras visuais.

A estrutura esperada é:

Design System
├── tokens compartilhados
├── tipografia
├── espaçamento
├── bordas
├── sombras
├── componentes
└── cores
    ├── Light
    └── Dark

O tema Dark atualmente existente deve ser evoluído e não simplesmente descartado.

O tema Light deverá seguir a mesma linguagem visual do Dark, mantendo consistência entre os modos.

## Princípios

Os componentes do SIGIN devem utilizar os tokens e componentes do Design System.

Telas e módulos não devem espalhar cores, espaçamentos ou estilos arbitrários.

A evolução deve evitar condicionais específicos de tema espalhados pelos módulos.

A escolha entre Light e Dark deve ser tratada pelo sistema de temas do MUI.

## Componentes prioritários

A F09 deverá avaliar principalmente:

- MainLayout
- Sidebar
- Header
- Dashboard
- DataTable
- formulários
- botões
- dialogs
- cards
- badges e status
- feedbacks
- loading
- empty states
- paginação
- campos de formulário
- navegação

## Arquitetura

A F09 não deve substituir a arquitetura existente do SIGIN.

Devem ser preservados:

- módulos;
- services;
- hooks;
- autenticação;
- autorização;
- React Query;
- Zustand;
- Router;
- PermissionGuard;
- AuthGuard;
- contratos da API.

A F09 é uma evolução visual e de Design System.

## Aurora

O Aurora deve ser tratado como referência visual e não como motivo para substituir a arquitetura existente.

A incorporação de código externo somente deve ocorrer quando houver compatibilidade clara com a arquitetura atual e benefício real.

Não copiar indiscriminadamente a estrutura do projeto Aurora para dentro do SIGIN.

## Escopo

A F09 deve preparar a base visual para que as próximas Sprints funcionais utilizem o novo Design System.

Após a evolução visual, novas funcionalidades deverão utilizar os componentes e tokens definidos pelo SIGIN.

## Fora do escopo

A F09 não deve:

- alterar regras de negócio;
- alterar contratos do Core;
- alterar banco de dados;
- substituir React;
- substituir Vite;
- substituir MUI;
- reestruturar os módulos funcionais sem necessidade;
- alterar autenticação;
- alterar autorização;
- criar funcionalidades de negócio;
- antecipar funcionalidades de Estoque, Produção ou Financeiro.

## Diretriz

A evolução visual deve reduzir retrabalho futuro.

O objetivo não é apenas deixar o sistema mais bonito, mas estabelecer uma base visual consistente para a evolução do SIGIN como produto.

## Fluxo

Theo_RCore
    ↓
Arquitetura e contratos Core

Theo_RFront
    ↓
Arquitetura, UX e Design System Front

Analista F09
    ↓
Análise do repositório e planejamento

Rick
    ↓
Execução no VS Code

Testes
    ↓
Commit / Push

Feedback
    ↓
Roadmap Front