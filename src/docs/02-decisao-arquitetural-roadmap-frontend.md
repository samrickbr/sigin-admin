# Decisão Arquitetural 001

## Assunto

Criação do Roadmap Frontend do SIGIN.

---

# Contexto

Até a Sprint 06, as decisões arquiteturais do SIGIN estavam concentradas no Roadmap do Core.

Com o início do desenvolvimento do Backoffice Administrativo, o Frontend passou a possuir arquitetura própria, demandando decisões específicas relacionadas à interface, componentes, navegação, estado da aplicação e experiência do usuário.

Para evitar que decisões arquiteturais e estruturais fossem tomadas durante as Sprints, foi criada uma camada de governança específica para o Frontend.

---

# Decisão

Foi instituído o Roadmap Frontend do SIGIN.

O Roadmap Frontend passa a ser responsável pelas decisões relacionadas à arquitetura e evolução do Frontend Administrativo.

O Roadmap do Core permanece como autoridade máxima para o domínio, regras de negócio, contratos e arquitetura do sistema.

O Frontend deve consumir e respeitar os contratos definidos pelo Core, sem criar interpretações próprias para substituir regras ou decisões ainda não definidas.

---

# Hierarquia

```text
Roadmap Core
      ↓
Roadmap Frontend
      ↓
Sprint Frontend
      ↓
Implementação
```

O Roadmap Frontend não substitui nem sobrepõe a autoridade do Roadmap Core.

---

# Responsabilidades

## Roadmap Core

Responsável por:

* domínio;
* arquitetura do sistema;
* banco de dados;
* APIs e contratos;
* segurança e permissões de domínio;
* regras de negócio;
* decisões arquiteturais do ERP.

## Roadmap Frontend

Responsável por:

* React;
* estrutura do projeto;
* layout;
* UX;
* UI;
* componentização;
* navegação;
* estado da aplicação;
* Design System;
* estratégias de consumo das APIs;
* experiência administrativa;
* evolução da arquitetura do Frontend.

---

# Comunicação entre os Roadmaps

Sempre que uma Sprint Front identificar uma dúvida, limitação ou inconsistência relacionada ao Core, o fluxo deverá ser:

```text
Sprint Front
      ↓
Feedback
      ↓
Roadmap Core
      ↓
Decisão arquitetural
      ↓
Evolução do Core, quando necessária
      ↓
Contrato atualizado
      ↓
Roadmap Front
      ↓
Sprint Front
```

O Frontend não deve alterar ou contornar uma decisão arquitetural do Core por iniciativa própria.

Quando uma questão envolver regra de negócio, domínio, contrato ou arquitetura do Core, ela deverá ser encaminhada ao Roadmap Core antes da implementação.

---

# Exemplo de aplicação — Produto × Canal

A arquitetura comercial definida pelo Core deve ser respeitada pelo Front.

No cadastro administrativo de Produtos, o Front utiliza `ProdutoCanal` para representar a disponibilidade do Produto em determinado `CanalVenda`.

O Produto permanece como cadastro central e único.

`ProdutoVenda`, embora continue existindo como conceito no Core, não é utilizado pelo Front como mecanismo de seleção ou disponibilidade de canais.

Essa decisão pertence à integração entre Front e Core e não autoriza o Front a criar abstrações paralelas para representar canais ou módulos comerciais.

---

# Benefícios

* Separação clara de responsabilidades.
* Independência de evolução entre Core e Frontend.
* Redução de retrabalho.
* Padronização das decisões.
* Maior previsibilidade das Sprints.
* Menor risco de divergência entre Frontend e Core.
* Escalabilidade para novos módulos.
* Preservação da autoridade arquitetural do Core.

---

# Status

**Aprovado.**

Esta decisão entrou em vigor com o início do desenvolvimento do Backoffice Administrativo do SIGIN e permanece válida para a evolução do Frontend.
