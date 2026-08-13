# Changelog — SIGIN Admin Frontend

Todas as alterações relevantes do projeto são registradas neste arquivo.

---

# [0.1.0-front] — Sprint F01

## Fundação do Backoffice Administrativo

### Adicionado

* Estrutura inicial React + Vite + TypeScript.
* Organização modular do frontend.
* React Router.
* Layout administrativo.
* Header.
* Sidebar.
* Autenticação JWT.
* Persistência de sessão com Zustand.
* AuthGuard para proteção de rotas.
* Axios configurado com interceptor JWT.
* React Query Provider.
* Material UI Theme.
* Tema padrão Dark.
* Estrutura inicial de permissões.

### Decisões

* Frontend permanece desacoplado das regras de negócio.
* Comunicação realizada exclusivamente através das APIs do Core.
* Controle granular de permissões preparado para integração com o contrato do Core.

---

# [0.2.0-front] — Sprint F02

## Design System + Componentes Base

### Adicionado

* Theme consolidado.
* Tokens visuais.
* Configurações e overrides do Material UI.
* `Loading`.
* `EmptyState`.
* `Feedback`.
* `ConfirmDialog`.
* `DataTable`.
* `FormError`.

### Decisões

* Componentes compartilhados devem ser reutilizados entre os módulos.
* Componentes próprios devem ser criados somente quando houver comportamento específico do SIGIN.
* Componentes MUI devem utilizar preferencialmente o Theme para padronização visual.

---

# [0.3.0-front] — Sprint F03

## Dashboard Administrativo

### Adicionado

* Dashboard Administrativo.
* Cards de indicadores.
* `DashboardIndicatorCard`.
* `dashboardService`.
* `useDashboard`.
* Estados de loading, vazio e erro.
* Integração com `MainLayout`.
* Proteção por `AuthGuard`.

### Decisões

* O Dashboard utiliza dados temporários encapsulados na camada de serviço enquanto não existir endpoint oficial de indicadores no Core.
* A futura integração com o Core deverá ocorrer preferencialmente através da camada de serviço existente.

### Validação

* Build de produção aprovado.
* Foram identificados problemas de lint relacionados à infraestrutura de permissões, posteriormente tratados na F04.

---

# [0.4.0-front] — Sprint F04

## IAM e Autenticação do Front

### Adicionado

* Integração com `GET /auth/me`.
* Tipagem `AuthMeResponse`.
* Tipagem de Pessoa.
* Tipagem de Perfil.
* Tipagem de Permissão.
* Carregamento da identidade autenticada.
* Restauração da sessão após recarregamento.
* Integração das permissões reais retornadas pelo Core.
* Consolidação do `AuthStore`.
* Integração do `AuthGuard`.
* Integração do `PermissionGuard`.

### Atualizado

* `authService.ts`.
* `authStore.ts`.
* `LoginPage.tsx`.
* `usePermission.ts`.
* `AuthGuard.tsx`.
* `PermissionGuard.tsx`.

### Fluxo

```text
POST /auth/login
        ↓
JWT
        ↓
persistência
        ↓
GET /auth/me
        ↓
identidade
        ↓
perfis + permissões
        ↓
AuthGuard / PermissionGuard
```

### Validação

* Login validado.
* `GET /auth/me` validado.
* Restauração de sessão validada.
* Sessão inválida tratada conforme resposta do Core.
* `npm run lint` executado com 0 erros.
* `git diff --check` sem problemas de whitespace.

---

# [0.5.0-front] — Sprint F05

## Produtos, Categorias e Canais de Venda

### Adicionado

#### Categorias

* Listagem.
* Cadastro.
* Edição.
* Ativação.
* Inativação.
* Feedback das operações.

#### Canais de Venda

* Listagem.
* Cadastro.
* Edição.
* Exclusão.
* Atualização da listagem.
* Feedback das operações.

#### Produto × Canal

* Integração Produto × CanalVenda.
* Utilização de `ProdutoCanal` para representar a disponibilidade do Produto por CanalVenda.
* Seleção de Canais de Venda no cadastro/edição de Produto.

### Atualizado

* Integração de Categoria ao Produto.
* Utilização de `ProdutoResponse.categoriaId` na edição de Produto.
* Fluxo administrativo de Produto.
* Rotas e navegação relacionadas a Produtos, Categorias e Canais de Venda.

### Decisões

* Produto permanece como cadastro central e único.
* Produto possui preço padrão.
* A disponibilidade do Produto por CanalVenda é representada por `ProdutoCanal`.
* CanalVenda representa o contexto comercial utilizado na relação Produto × Canal.
* `ProdutoVenda` permanece como conceito existente no Core, mas não é utilizado pelo Frontend como mecanismo de seleção ou disponibilidade de canais.
* A antiga `ProdutoVendaPage` não faz parte do fluxo atual do Frontend.
* O Frontend utiliza diretamente `ProdutoResponse.categoriaId` para preencher a Categoria durante a edição de Produto.
* O Frontend não infere Categoria pelo nome.

### Validação

* Build de produção aprovado.
* TypeScript aprovado durante o build.
* Vite concluiu o build de produção com sucesso.

---

# Estado Atual

A versão atual registrada neste changelog é:

**0.5.0-front — Sprint F05**

As próximas versões serão definidas pelo Roadmap Frontend.

O changelog registra somente alterações efetivamente implementadas e decisões consolidadas no projeto.
