# docs/01-roadmap-front.md

# Roadmap Frontend — SIGIN

## Objetivo

Este documento define a arquitetura, diretrizes e evolução do Frontend Administrativo do SIGIN.

O Roadmap Frontend é responsável exclusivamente pelas decisões relacionadas à interface, experiência do usuário e arquitetura React.

As regras de negócio, modelo de domínio e arquitetura do ERP permanecem sob responsabilidade do Roadmap do Core.

---

# Hierarquia de decisão

Roadmap Core (Autoridade Máxima)

↓

Roadmap Frontend

↓

Sprint Frontend

↓

Implementação

↓

Testes

↓

Documentação

↓

Commit / Tag

↓

Feedback

↓

Roadmap Frontend

Caso seja identificada alguma limitação arquitetural do Core, esta deverá ser registrada como feedback para o Roadmap do Core, não sendo permitidas alterações estruturais durante a Sprint Frontend.

---

# Responsabilidades do Roadmap Frontend

Definir:

* Arquitetura React;
* Estrutura do projeto;
* Organização dos módulos;
* Navegação;
* Layout administrativo;
* Design System;
* Componentes reutilizáveis;
* Estratégia de autenticação;
* Estratégia de autorização;
* Consumo das APIs do Core;
* Experiência do usuário (UX);
* Interface (UI);
* Performance do Frontend.

Não definir:

* Regras de negócio;
* Estrutura do banco de dados;
* APIs do Core;
* Entidades do domínio;
* Alterações arquiteturais do Core.

---

# Princípios

Antes de qualquer implementação, responder obrigatoriamente:

1. O que já existe?
2. O que pode ser reutilizado?
3. O que precisa ser evoluído?
4. O que realmente precisa ser criado?

É vedado durante as Sprints:

* recriar componentes existentes;
* substituir implementações apenas por preferência técnica;
* alterar padrões definidos neste Roadmap sem aprovação;
* criar regras de negócio no Frontend.

Sempre priorizar evolução antes de substituição.

---

# Organização das Sprints

Cada Sprint Front deverá seguir obrigatoriamente o fluxo:

Planejamento

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

Atualização do Roadmap

---

# Estado atual

Projeto criado utilizando:

* React
* Vite
* TypeScript

Estrutura inicial preparada.

React Router configurado.

Layout base iniciado.

A próxima Sprint será definida por este Roadmap.

---

# Objetivo do Frontend

Construir o Backoffice Administrativo do SIGIN, que será utilizado pelos módulos:

* Core
* Delivery
* PDV
* Comanda
* Produção
* Financeiro
* Demais módulos futuros

O Backoffice representa o ERP como um todo, não um módulo específico.
