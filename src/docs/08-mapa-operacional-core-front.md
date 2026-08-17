# Mapa Operacional Core × Front

## Objetivo

Mapa resumido dos recursos existentes no SIGIN Core e sua disponibilidade no Front Administrativo.

## Regra

Core = regras de negócio, persistência e contratos.

Front = experiência, administração e operação.

Este documento é um mapa de referência e deve ser atualizado ao final de cada Sprint que altere contratos ou cobertura do Front.

---

## Status padronizados

- CORE COMPLETO
- CORE PARCIAL
- FRONT COMPLETO
- FRONT PARCIAL
- DEPENDÊNCIA CORE
- NÃO IMPLEMENTADO
- FORA DO ESCOPO ATUAL

---

## Mapa principal

| Domínio                  | Core | API                                      | Front   | Status               | Observação                                                                               |
| ------------------------ | ---- | ---------------------------------------- | ------- | -------------------- | ---------------------------------------------------------------------------------------- |
| Autenticação / IAM       | Sim  | `/auth`                                  | Sim     | FRONT COMPLETO       | Login, `/auth/me`, JWT e infraestrutura de autorização                                  |
| Usuários                 | Sim  | `/usuarios`                              | Sim     | FRONT COMPLETO       | CRUD administrativo                                                                     |
| Perfis                   | Sim  | `/perfis`                                | Sim     | FRONT COMPLETO       | Administração de perfis implementada na F06                                             |
| Permissões               | Sim  | `/permissoes`                            | Sim     | FRONT PARCIAL        | Permissões consumidas pela autorização e disponibilizadas para configuração de Perfil × Permissão |
| Usuário × Perfil         | Sim  | `/usuarios/{usuarioId}/perfis`           | Sim     | FRONT COMPLETO       | Associação contextual no Usuário, concluída na F11.2                                    |
| Perfil × Permissão       | Sim  | `/perfil-permissoes`                     | Sim     | FRONT COMPLETO       | Administração da associação implementada na F06                                          |
| Pessoas                  | Sim  | `/pessoas`                               | Sim     | FRONT COMPLETO       | CRUD administrativo                                                                     |
| Tipos de Pessoa          | Sim  | `/tipos-pessoa`                          | Parcial | FRONT PARCIAL        | Consumido pelo módulo de Pessoas; sem módulo/página própria identificada                |
| Produtos                 | Sim  | `/produtos`                              | Sim     | FRONT COMPLETO       | CRUD, inativos e edição                                                                  |
| Categorias               | Sim  | `/categorias`                            | Sim     | FRONT COMPLETO       | CRUD administrativo                                                                     |
| Canais de Venda          | Sim  | `/api/canais-venda`                      | Sim     | FRONT COMPLETO       | CRUD administrativo                                                                     |
| Produto × Canal          | Sim  | `/api/produtos-canais`                   | Sim     | FRONT PARCIAL        | Integrado ao módulo de Produtos; não possui módulo próprio                              |
| ProdutoVenda             | Sim  | `/api/produtos-vendas`                   | Não     | NÃO IMPLEMENTADO     | Contrato existente; não identificado no Front Administrativo                            |
| Produto × Material       | Sim  | `/produto-materiais`                     | Não     | NÃO IMPLEMENTADO     | Sem cobertura administrativa identificada                                               |
| Materiais                | Sim  | `/materiais`                             | Sim     | FRONT COMPLETO       | Manutenção administrativa implementada na F07                                           |
| Estoque                  | Sim  | `/estoque`                               | Não     | NÃO IMPLEMENTADO     | Sem cobertura administrativa identificada                                               |
| Locais                   | Sim  | `/locais`                                | Sim     | FRONT COMPLETO       | Manutenção administrativa implementada na F07                                           |
| Movimentações de Estoque | Sim  | `/movimentacoes-estoque`                 | Não     | NÃO IMPLEMENTADO     | Sem cobertura administrativa identificada                                               |
| Reserva de Estoque       | Sim  | contrato interno identificado            | Não     | NÃO IMPLEMENTADO     | Sem interface administrativa identificada                                                |
| Financeiro               | Sim  | `/financeiro/*`                          | Não     | NÃO IMPLEMENTADO     | Caixa, contas a receber e formas de pagamento                                           |
| Pedidos                  | Sim  | `/pedidos`                               | Não     | NÃO IMPLEMENTADO     | Sem interface administrativa identificada                                               |
| Produção                 | Sim  | `/ordens-producao`                       | Não     | NÃO IMPLEMENTADO     | Sem interface administrativa identificada                                               |
| OP × Material            | Sim  | `/op-materiais`                          | Não     | NÃO IMPLEMENTADO     | Sem interface administrativa identificada                                               |
| Apontamentos de Produção | Sim  | `/apontamentos-producao`                 | Não     | NÃO IMPLEMENTADO     | Sem interface administrativa identificada                                               |
| Delivery                 | Sim  | `/api/delivery/*`, `/delivery/balcao`    | Não     | FORA DO ESCOPO ATUAL | APIs operacionais existentes; não fazem parte da cobertura atual do Front Administrativo |

---

## Contratos por domínio

### Autenticação / IAM

- `POST /auth/login`
- `GET /auth/me`

Front:

- `LoginPage`
- `authService`
- `authStore`
- `AuthGuard`
- `usePermission`
- `PermissionGuard`

Status:

`FRONT COMPLETO`

Particularidade:

O Front utiliza as permissões retornadas pelo Core para autorização de rotas e funcionalidades. Não deve reconstruir regras de permissão.

---

### Usuários

Endpoints:

- `GET /usuarios`
- `GET /usuarios/{id}`
- `POST /usuarios`
- `PUT /usuarios/{id}`
- `DELETE /usuarios/{id}`

Associações:

- `POST /usuarios/{usuarioId}/perfis/{perfilId}`
- `GET /usuarios/{usuarioId}/perfis`
- `DELETE /usuarios/{usuarioId}/perfis/{perfilId}`

Front:

- `UsuariosListPage`
- `UsuarioFormPage`
- `usuariosService`
- `useUsuarios`
- `usuarioPerfisService`
- `useUsuarioPerfis`
- `UsuarioPerfisSection`

Status:

`FRONT COMPLETO`

Particularidade:

O relacionamento permite múltiplos perfis por Usuário. A F11.2 administra os vínculos no contexto do Usuário, oferecendo somente perfis ativos ainda não vinculados para nova atribuição e preservando a visualização de perfis inativos já vinculados.

Dependência de contrato corrigida no Core:

`UsuarioPerfilRepository` passou a utilizar `SELECT DISTINCT` com `LEFT JOIN FETCH` nas permissões. Antes, um `INNER JOIN` impedia o retorno de perfis vinculados sem permissões. O ajuste pertence ao Core e garante o retorno correto de `PerfilResponse[]` em `GET /usuarios/{usuarioId}/perfis`.

---

### Perfis

Endpoints:

- `GET /perfis`
- `GET /perfis/{id}`
- `POST /perfis`
- `PUT /perfis/{id}`
- `DELETE /perfis/{id}`

Front:

- `PerfisListPage`
- `PerfilFormPage`
- `perfisService`
- `usePerfis`

Integração:

- configuração de Perfil × Permissão

Status:

`FRONT COMPLETO`

---

### Permissões

Endpoints:

- `GET /permissoes`
- `GET /permissoes/{id}`
- `POST /permissoes`
- `PUT /permissoes/{id}`
- `DELETE /permissoes/{id}`

Associação:

- `POST /perfil-permissoes`
- `GET /perfil-permissoes`
- `DELETE /perfil-permissoes/{id}`

Front:

- `PermissoesListPage`
- `permissoesService`
- `usePermissoes`
- integração com Perfil × Permissão
- utilização pela infraestrutura de autorização através de `usePermission` e `PermissionGuard`

Status:

`FRONT PARCIAL`

---

### Perfil × Permissão

Endpoints:

- `POST /perfil-permissoes`
- `GET /perfil-permissoes`
- `DELETE /perfil-permissoes/{id}`

Front:

- `permissoesService`
- tipos `PerfilPermissaoRequest` e `PerfilPermissaoResponse`
- integração administrativa com Perfis

Status:

`FRONT COMPLETO`

---

### Pessoas

Endpoints:

- `GET /pessoas`
- `GET /pessoas/{id}`
- `POST /pessoas`
- `PUT /pessoas/{id}`
- `DELETE /pessoas/{id}`
- `POST /pessoas/{id}/tipos`

Front:

- `PessoasListPage`
- `PessoaFormPage`
- `pessoasService`
- `usePessoas`

Integração adicional:

- `GET /tipos-pessoa`
- `POST /tipos-pessoa`

Status:

`FRONT COMPLETO`

---

### Tipos de Pessoa

Endpoints:

- `GET /tipos-pessoa`
- `POST /tipos-pessoa`

Front:

Consumido pelo módulo de Pessoas.

Não foi identificada página própria para administração dos tipos.

Status:

`FRONT PARCIAL`

---

### Produtos

Endpoints:

- `GET /produtos`
- `GET /produtos/{id}`
- `POST /produtos`
- `PUT /produtos/{id}`
- `DELETE /produtos/{id}`
- `GET /produtos/inativos`
- `GET /produtos/cardapio`

Front:

- `ProdutosListPage`
- `ProdutoFormPage`
- `produtosService`
- `useProdutos`

Integração Produto × Canal:

- `GET /api/produtos-canais`
- `POST /api/produtos-canais`
- `PUT /api/produtos-canais/{id}`
- `DELETE /api/produtos-canais/{id}`

Status:

`FRONT COMPLETO`

Particularidade:

`ProdutoResponse` possui `categoriaId`, utilizado pelo Front na edição do Produto.

---

### Categorias

Endpoints:

- `GET /categorias`
- `GET /categorias/{id}`
- `POST /categorias`
- `PUT /categorias/{id}`

Front:

- `CategoriasListPage`
- `CategoriaFormPage`
- `categoriasService`
- `useCategorias`

Status:

`FRONT COMPLETO`

---

### Canais de Venda

Endpoints:

- `GET /api/canais-venda`
- `GET /api/canais-venda/{id}`
- `POST /api/canais-venda`
- `PUT /api/canais-venda/{id}`
- `DELETE /api/canais-venda/{id}`

Front:

- `CanaisVendaListPage`
- `CanalVendaFormPage`
- `canaisVendaService`
- `useCanaisVenda`

Status:

`FRONT COMPLETO`

---

### Produto × Canal

Endpoints:

- `GET /api/produtos-canais`
- `GET /api/produtos-canais/{id}`
- `POST /api/produtos-canais`
- `PUT /api/produtos-canais/{id}`
- `DELETE /api/produtos-canais/{id}`

Front:

Integrado ao módulo `produtos`.

Não existe módulo administrativo separado de Produto × Canal identificado.

Status:

`FRONT PARCIAL`

---

### ProdutoVenda

Endpoints:

- `GET /api/produtos-vendas`
- `GET /api/produtos-vendas/{id}`
- `POST /api/produtos-vendas`
- `PUT /api/produtos-vendas/{id}`
- `DELETE /api/produtos-vendas/{id}`

Front:

Nenhuma integração ou página administrativa identificada.

Status:

`NÃO IMPLEMENTADO`

---

### Materiais

Endpoints:

- `POST /materiais`
- `GET /materiais`
- `GET /materiais/{id}`
- `PUT /materiais/{id}`
- `DELETE /materiais/{id}`

Contratos confirmados:

### `MaterialRequest`

- `codigo`
- `nome`
- `descricao`
- `unidadeMedida`
- `estoqueMinimo`

### `MaterialUpdateRequest`

- `nome`
- `descricao`
- `unidadeMedida`
- `estoqueMinimo`
- `ativo`

### `MaterialResponse`

- `id`
- `codigo`
- `nome`
- `descricao`
- `unidadeMedida`
- `estoqueMinimo`
- `ativo`
- `dataCriacao`

Front:

- `MateriaisListPage`
- `MaterialFormPage`
- `materiaisService`
- `useMateriais`

Integração:

- Router
- Sidebar
- React Query
- React Hook Form
- Zod
- componentes compartilhados de loading, estado vazio, feedback, confirmação e tabela

Status:

`FRONT COMPLETO`

Particularidade:

O Front utiliza os contratos reais do Core. Não foram criadas permissões específicas fictícias para Materiais.

---

### Estoque

Endpoints:

- `GET /estoque`
- `GET /estoque/disponivel/{materialId}`

Front:

Nenhuma interface administrativa identificada.

Status:

`NÃO IMPLEMENTADO`

---

### Locais

Endpoints:

- `POST /locais`
- `GET /locais`
- `GET /locais/{id}`
- `PUT /locais/{id}`
- `DELETE /locais/{id}`

Contratos confirmados:

### `LocalRequest`

- `nome`

### `LocalUpdateRequest`

- `nome`
- `ativo`

### `LocalResponse`

- `id`
- `nome`
- `ativo`
- `dataCriacao`

Front:

- `LocaisListPage`
- `LocalFormPage`
- `locaisService`
- `useLocais`

Integração:

- Router
- Sidebar
- React Query
- React Hook Form
- Zod
- `DataTable`
- `Loading`
- `EmptyState`
- `Feedback`
- `ConfirmDialog`

Status:

`FRONT COMPLETO`

Particularidade:

A exclusão utiliza confirmação antes da execução e o Front consome diretamente o contrato `DELETE /locais/{id}`.

Não foram criadas permissões específicas fictícias para Locais.

---

### Movimentações de Estoque

Endpoints:

- `GET /movimentacoes-estoque`
- `GET /movimentacoes-estoque/{id}`
- `POST /movimentacoes-estoque`
- `PUT /movimentacoes-estoque/{id}`
- `DELETE /movimentacoes-estoque/{id}`

Front:

Nenhuma interface administrativa identificada.

Status:

`NÃO IMPLEMENTADO`

---

### Pedidos

Endpoints:

- `GET /pedidos`
- `GET /pedidos/{id}`
- `POST /pedidos`
- `PATCH /pedidos/{id}/cancelar`
- `PATCH /pedidos/{id}/producao`
- `POST /pedidos/{id}/gerar-op`
- `POST /pedidos/{id}/faturar`

Itens:

- `POST /pedidos/{pedidoId}/itens`
- `GET /pedidos/{pedidoId}/itens`

Front Administrativo:

Nenhuma página administrativa identificada.

Status:

`NÃO IMPLEMENTADO`

---

### Produção

Ordens de Produção:

- `GET /ordens-producao`
- `GET /ordens-producao/{id}`
- `POST /ordens-producao`
- `PUT /ordens-producao/{id}`
- `DELETE /ordens-producao/{id}`
- `POST /ordens-producao/{id}/reservar`
- `POST /ordens-producao/{id}/iniciar`
- `POST /ordens-producao/{id}/concluir`
- `POST /ordens-producao/{id}/cancelar`
- `POST /ordens-producao/{id}/falhar`
- `POST /ordens-producao/{id}/reabrir`

OP × Material:

- `POST /op-materiais`
- `GET /op-materiais/ordem/{ordemProducaoId}`
- `PUT /op-materiais/{id}`
- `DELETE /op-materiais/{id}`

Apontamentos:

- `POST /apontamentos-producao`
- `GET /apontamentos-producao/ordem/{ordemProducaoId}`
- `GET /apontamentos-producao/{id}`
- `PUT /apontamentos-producao/{id}`
- `DELETE /apontamentos-producao/{id}`

Front Administrativo:

Nenhuma interface identificada.

Status:

`NÃO IMPLEMENTADO`

---

### Financeiro

Endpoints identificados:

#### Caixa

- `POST /financeiro/caixa`
- `GET /financeiro/caixa`

#### Contas a Receber

- `GET /financeiro/contas-receber`
- `GET /financeiro/contas-receber/{id}`

#### Formas de Pagamento

- `POST /financeiro/formas-pagamento`
- `GET /financeiro/formas-pagamento`

Front:

Nenhuma interface administrativa identificada.

Status:

`NÃO IMPLEMENTADO`

---

## Regras arquiteturais de referência

### Produto

Produto é o cadastro central.

Possui:

- dados gerais;
- preço padrão;
- disponibilidade geral.

### Produto × Canal

`ProdutoCanal` representa a disponibilidade do Produto em determinado `CanalVenda`.

O fluxo administrativo de disponibilidade utiliza `ProdutoCanal`.

### CanalVenda

Representa o contexto/canal comercial utilizado pelo SIGIN.

### ProdutoVenda

`ProdutoVenda` é um contrato distinto de `ProdutoCanal`.

Não é utilizado pelo Front para selecionar canais do Produto.

### Materiais

Material representa um recurso necessário para a operação de estoque e produção.

A manutenção administrativa de Materiais utiliza exclusivamente os contratos disponibilizados pelo Core.

O relacionamento Produto × Material não faz parte da F07.

### Locais

Local representa um local cadastrado para utilização pela operação de estoque.

A manutenção administrativa de Locais utiliza exclusivamente os contratos disponibilizados pelo Core.

Operações de estoque não fazem parte da F07.

### Core

Core é a autoridade sobre regras de negócio, persistência e contratos.

### Front

Front não deve reconstruir regras do Core.

O Front deve consumir os contratos existentes e representar a experiência administrativa.

### Delivery

Delivery deverá consumir o Core e não duplicar seus domínios.

---

## Dependências Core conhecidas

- `ProdutoResponse.categoriaId` — concluído e utilizado pelo Front.
- manutenção de Categoria — contrato existente e consumido pelo Front.
- contratos de `CanalVenda` — existentes e consumidos pelo Front.
- contratos de `ProdutoCanal` — existentes e consumidos pelo módulo de Produtos.
- contratos de `ProdutoVenda` — existentes, mas sem cobertura identificada no Front Administrativo.
- contratos de `Material` — confirmados e consumidos pelo Front na F07.
- contratos de `Local` — confirmados e consumidos pelo Front na F07.

Nenhuma dependência Core bloqueante foi identificada durante a F07.

---

## Cobertura atual do Front

### Autenticação

- Login
- Recuperação do usuário autenticado
- Controle de acesso por autenticação
- Controle de acesso por permissão
- Página 403

### Dashboard

- `DashboardPage`

O service do Dashboard existe, mas não foram identificados contratos API associados durante o levantamento.

### Pessoas

- `PessoasListPage`
- `PessoaFormPage`

### Usuários

- `UsuariosListPage`
- `UsuarioFormPage`

### Perfis

- `PerfisListPage`
- `PerfilFormPage`
- integração com Perfil × Permissão

### Permissões

- `PermissoesListPage`
- `PermissaoFormPage`
- integração com Perfil × Permissão
- utilização pela infraestrutura de autorização

### Produtos

- `ProdutosListPage`
- `ProdutoFormPage`
- integração com Categorias
- integração com Produto × Canal

### Categorias

- `CategoriasListPage`
- `CategoriaFormPage`

### Canais de Venda

- `CanaisVendaListPage`
- `CanalVendaFormPage`

### Materiais

- `MateriaisListPage`
- `MaterialFormPage`
- `materiaisService`
- `useMateriais`
- rotas administrativas
- integração com Sidebar

### Locais

- `LocaisListPage`
- `LocalFormPage`
- `locaisService`
- `useLocais`
- rotas administrativas
- integração com Sidebar

---

## Áreas ainda sem cobertura suficiente

Recursos do Core atualmente sem cobertura administrativa identificada:

- ProdutoVenda
- Produto × Material
- Estoque
- Movimentações de Estoque
- Reserva de Estoque
- Financeiro
- Pedidos
- Produção
- OP × Material
- Apontamentos de Produção

Tipos de Pessoa possuem apenas cobertura parcial através do módulo de Pessoas.

Produto × Canal possui cobertura parcial integrada ao módulo de Produtos.

Permissões possuem cobertura parcial como manutenção administrativa, pois a cobertura depende da infraestrutura de autorização e da configuração de Perfil × Permissão.

Materiais e Locais possuem cobertura administrativa completa após a F07.

---

## Como utilizar este documento

Antes de iniciar uma Sprint:

1. consultar este mapa;
2. verificar o status do domínio;
3. verificar os endpoints registrados;
4. verificar a localização do Front;
5. consultar o Core somente quando houver dúvida ou lacuna;
6. atualizar este documento quando a Sprint alterar o estado do domínio.

Objetivo:

Evitar novas investigações completas do projeto a cada Sprint.

---

## Precisão do levantamento

Este documento representa somente informações confirmadas no levantamento atual.

Não foram assumidos:

- endpoints não identificados;
- permissões não identificadas;
- páginas não identificadas;
- services não identificados;
- regras de negócio não confirmadas.

Quando uma informação não pôde ser confirmada pelo levantamento, ela não foi utilizada como fato.
