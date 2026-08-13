# Decisões Técnicas — Frontend Administrativo SIGIN

Este documento registra decisões técnicas que devem ser observadas durante a evolução do Frontend Administrativo do SIGIN.

As decisões aqui registradas complementam o Roadmap Frontend e devem ser respeitadas durante as Sprints, salvo revisão formal posterior.

---

# Decisão Técnica 001 — MUI 9 Typography e Props de Sistema

## Contexto

Durante a Sprint F03 foi identificado um problema de tipagem utilizando Material UI 9 com TypeScript.

O uso de propriedades de sistema diretamente em componentes MUI pode gerar conflitos de tipagem e erros de compilação.

---

## Problema identificado

O padrão abaixo deve ser evitado:

```tsx
<Typography
  variant="h4"
  fontWeight={700}
  mb={4}
>
```

Esse padrão pode causar erros de tipagem no TypeScript com MUI 9.

---

## Padrão aprovado

Utilizar a propriedade `sx` para propriedades visuais e de layout.

Exemplo:

```tsx
<Typography
  variant="h4"
  sx={{
    fontWeight: 700,
    mb: 4,
  }}
>
```

---

## Regra

Propriedades relacionadas a estilo e layout devem utilizar `sx`.

Utilizar:

```tsx
sx={{
  fontWeight: 700,
  mb: 4,
  mt: 2,
  p: 3,
}}
```

Evitar:

```tsx
fontWeight={700}
mb={4}
mt={2}
p={3}
```

A regra se aplica mesmo quando a propriedade estiver disponível visualmente no componente, sempre que representar configuração de estilo ou layout.

---

## Abrangência

Esta decisão vale para todo o Frontend Administrativo do SIGIN.

Aplicar a:

* `Typography`;
* `Box`;
* `Stack`;
* `Paper`;
* `Card`;
* demais componentes Material UI.

---

## Motivo

* Compatibilidade com MUI 9;
* Melhor previsibilidade do TypeScript;
* Padronização do código;
* Redução de erros durante a evolução do Design System.

---

## Status

**Aprovado.**

A decisão permanece válida para as próximas Sprints enquanto não houver nova decisão técnica que a substitua.

---

# Decisão Técnica 002 — Reutilização da Infraestrutura Compartilhada

## Contexto

O Frontend Administrativo possui infraestrutura compartilhada para comunicação com o Core, gerenciamento de estado assíncrono, autenticação, layout e componentes comuns.

Durante a evolução das Sprints, foi consolidada a necessidade de preservar essa infraestrutura e evitar implementações paralelas.

---

## Padrão aprovado

Os módulos devem reutilizar, conforme necessidade:

* `src/services/api.ts`;
* `src/services/queryClient.ts`;
* React Query;
* componentes compartilhados;
* `MainLayout`;
* `Header`;
* `Sidebar`;
* guards existentes;
* infraestrutura de autenticação;
* padrões de formulários já estabelecidos.

---

## Regra

Não criar uma nova infraestrutura de comunicação, cache, autenticação, layout ou componentes compartilhados quando já existir implementação adequada no projeto.

Antes de criar uma nova implementação, verificar se a infraestrutura existente pode ser reutilizada ou evoluída.

---

## Motivo

* Evitar duplicação;
* preservar consistência arquitetural;
* reduzir manutenção;
* facilitar evolução dos módulos;
* manter comportamento uniforme no Backoffice.

---

## Status

**Aprovado.**

---

# Decisão Técnica 003 — Consumo de Contratos do Core

## Contexto

O Core é a autoridade sobre regras de negócio e contratos de domínio do SIGIN.

O Frontend Administrativo deve consumir os contratos disponibilizados pelo Core sem criar interpretações ou abstrações que alterem seu significado.

---

## Padrão aprovado

Cada módulo deve possuir sua camada de integração com a API, utilizando:

* services;
* hooks;
* types;
* React Query;
* cliente Axios compartilhado.

Os contratos devem representar os dados efetivamente disponibilizados pelo Core.

---

## Regra

O Front não deve:

* inventar endpoints;
* inventar campos;
* inventar permissões;
* duplicar regras de negócio;
* inferir identificadores quando o contrato já fornece o dado necessário;
* criar workarounds para substituir comportamento do Core.

Quando houver inconsistência ou dúvida sobre contrato, a questão deve ser encaminhada ao Roadmap apropriado antes de uma alteração estrutural.

---

## Status

**Aprovado.**

---

# Decisão Técnica 004 — Organização Modular

## Contexto

O Frontend Administrativo possui arquitetura modular, permitindo que funcionalidades específicas permaneçam isoladas enquanto a infraestrutura compartilhada permanece centralizada.

---

## Padrão aprovado

Módulos devem permanecer organizados em:

```text
src/modules/<modulo>/
├── components/
├── hooks/
├── pages/
├── services/
└── types/
```

Nem todos os diretórios precisam existir quando não houver necessidade.

Componentes e infraestrutura compartilhados devem permanecer em:

```text
src/components/
src/services/
src/styles/
src/guards/
src/auth/
```

---

## Regra

Não mover arquivos apenas por organização durante uma Sprint.

A estrutura existente deve ser preservada quando estiver adequada ao projeto.

Novos módulos devem seguir o padrão já estabelecido.

---

## Motivo

* previsibilidade;
* isolamento funcional;
* facilidade de manutenção;
* reutilização;
* consistência entre módulos.

---

## Status

**Aprovado.**

---

# Decisão Técnica 005 — Produto × Canal no Front

## Contexto

Durante a F05 foi consolidada a utilização de `ProdutoCanal` para representar a disponibilidade de um Produto em determinado `CanalVenda`.

Essa decisão segue a arquitetura definida pelo Core.

---

## Padrão aprovado

O Front deve representar o relacionamento como:

```text
Produto
   ↓
CanalVenda
   ↓
ProdutoCanal
```

Produto permanece como cadastro central e único.

A disponibilidade por canal é representada pelo vínculo `ProdutoCanal`.

---

## Regra

O Front não deve utilizar `ProdutoVenda` como mecanismo de seleção ou disponibilidade de canais do Produto.

Não criar conceitos paralelos como:

* `ProdutoDelivery`;
* `ProdutoBalcao`;
* `ProdutoMarketplace`;
* `CanalModulo`;
* abstrações equivalentes.

Questões de arquitetura ou regras de negócio relacionadas a esse modelo devem ser encaminhadas ao Roadmap Core.

---

## Status

**Aprovado.**

---

# Decisão Técnica 006 — Identificador de Categoria no Produto

## Contexto

O contrato de Produto foi evoluído pelo Core para disponibilizar diretamente o identificador da Categoria.

O `ProdutoResponse` passou a disponibilizar:

```text
categoriaId
```

---

## Padrão aprovado

Durante a edição de Produto, o Front deve utilizar diretamente:

```text
ProdutoResponse.categoriaId
```

para preencher o campo de Categoria.

O valor selecionado deve ser enviado ao Core através de:

```text
ProdutoRequest.categoriaId
```

---

## Regra

O Front não deve:

* inferir a categoria pelo nome;
* procurar o ID da categoria pelo nome;
* realizar chamada adicional apenas para descobrir o ID;
* criar workaround para substituir o contrato do Core.

---

## Motivo

* utilizar diretamente o contrato oficial;
* reduzir chamadas desnecessárias;
* evitar dependência de nomes;
* preservar a responsabilidade do Core sobre o domínio.

---

## Status

**Aprovado.**
