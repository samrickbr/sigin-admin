# docs/02-decisao-arquitetural-roadmap-frontend.md

# Decisão Arquitetural 001

## Assunto

Criação do Roadmap Frontend do SIGIN.

---

# Contexto

Até a Sprint 06, todas as decisões arquiteturais estavam concentradas no Roadmap do Core.

Com o início do desenvolvimento do Backoffice Administrativo, o Frontend passou a possuir arquitetura própria, demandando decisões específicas de interface, componentes e experiência do usuário.

Para evitar que decisões de implementação fossem tomadas durante as Sprints, foi criada uma camada de governança exclusiva para o Frontend.

---

# Decisão

Foi instituído o Roadmap Frontend do SIGIN.

Este Roadmap passa a ser responsável pelas decisões relacionadas ao Frontend Administrativo.

O Roadmap do Core permanece como autoridade máxima da plataforma.

---

# Hierarquia

Roadmap Core

↓

Roadmap Frontend

↓

Sprint Frontend

---

# Responsabilidades

Roadmap Core:

* domínio;
* arquitetura;
* banco;
* APIs;
* segurança;
* regras de negócio.

Roadmap Frontend:

* React;
* Layout;
* UX;
* UI;
* Componentização;
* Navegação;
* Estado da aplicação;
* Design System;
* Estratégias de consumo das APIs.

---

# Comunicação entre os Roadmaps

Sempre que uma Sprint Front identificar limitação no Core, o fluxo será:

Sprint Front

↓

Feedback

↓

Roadmap Core

↓

Nova decisão arquitetural

↓

Nova Sprint Core

↓

API evoluída

↓

Roadmap Front

↓

Nova Sprint Front

---

# Benefícios

* Separação clara de responsabilidades.
* Independência de evolução entre Core e Frontend.
* Redução de retrabalho.
* Padronização das decisões.
* Maior previsibilidade das Sprints.
* Escalabilidade para novos módulos.

---

# Status

Aprovado.

Esta decisão entra em vigor a partir do início do desenvolvimento do Backoffice Administrativo do SIGIN.
