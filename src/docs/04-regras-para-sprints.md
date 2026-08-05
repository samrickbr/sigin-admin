# docs/04-regras-para-sprints.md

# Regras para Agentes de Sprint — Frontend Administrativo do SIGIN

## Objetivo

Este documento estabelece as regras obrigatórias que deverão ser seguidas durante toda Sprint do Frontend Administrativo do SIGIN.

Toda Sprint é responsável apenas pela implementação das decisões aprovadas pelo Roadmap Frontend.

Não é responsabilidade da Sprint definir arquitetura.

---

# Hierarquia de decisões

A seguinte ordem deve ser respeitada obrigatoriamente:

Roadmap Core

↓

Roadmap Frontend

↓

Sprint Frontend

↓

Implementação

Caso exista conflito entre documentos, prevalece sempre:

1. Roadmap Core.
2. Roadmap Frontend.
3. Este documento.
4. Sprint em execução.

---

# Responsabilidade da Sprint

A Sprint deverá exclusivamente:

* implementar funcionalidades aprovadas;
* reutilizar componentes existentes;
* consumir APIs do Core;
* executar testes;
* atualizar documentação;
* preparar commit e tag;
* registrar feedback para o Roadmap.

---

# Antes de qualquer implementação

A Sprint deverá responder obrigatoriamente:

## O que já existe?

Identificar componentes, hooks, serviços, layouts e módulos já implementados.

---

## O que pode ser reutilizado?

Priorizar sempre reutilização.

É proibido duplicar componentes.

---

## O que precisa apenas ser evoluído?

Caso exista implementação semelhante, esta deverá ser evoluída.

---

## O que realmente precisa ser criado?

Somente após responder às perguntas anteriores.

---

# É vedado durante a Sprint

* alterar arquitetura do Core;
* criar regras de negócio;
* duplicar validações existentes no backend;
* criar autenticação própria;
* alterar decisões aprovadas pelo Roadmap;
* mover arquivos apenas por organização;
* substituir bibliotecas por preferência pessoal;
* criar componentes específicos quando um componente genérico puder atender.

---

# Arquitetura do Front

O Frontend deverá permanecer dividido em módulos independentes.

Cada módulo deverá conter seus próprios componentes, páginas, hooks, tipos e integração com APIs quando necessário.

Componentes compartilhados deverão permanecer em áreas comuns.

---

# Regras para consumo do Core

Toda regra de negócio pertence ao Core.

O Frontend deverá apenas:

* consumir APIs;
* apresentar informações;
* validar experiência do usuário;
* controlar navegação;
* controlar autenticação;
* controlar autorização.

Nunca implementar regras que possam ser centralizadas no Core.

---

# Componentização

Antes de criar qualquer componente perguntar:

Existe componente semelhante?

Pode ser reutilizado?

Pode ser evoluído?

Somente criar novo componente quando necessário.

---

# UX e UI

Durante a Sprint deverão ser priorizados:

* simplicidade;
* consistência visual;
* reutilização;
* acessibilidade;
* padronização.

Evitar soluções específicas para um único módulo.

---

# Design System

Todo componente novo deverá considerar futura reutilização pelos módulos:

* Dashboard;
* Pessoas;
* Produtos;
* Financeiro;
* Produção;
* Delivery;
* PDV;
* Comanda;
* Configurações;
* módulos futuros.

---

# Fluxo oficial da Sprint

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

Roadmap Frontend

---

# Limitações encontradas

Caso uma limitação arquitetural seja identificada:

Não corrigir durante a Sprint.

Registrar como feedback.

Encaminhar ao Roadmap Frontend.

Caso a limitação seja do Core, registrar feedback ao Roadmap Core.

---

# Finalização obrigatória

Toda Sprint deverá entregar:

* implementação funcional;
* testes executados;
* documentação atualizada;
* commit sugerido;
* tag sugerida;
* feedback para o Roadmap Frontend;
* feedback para o Roadmap Core (quando necessário).

Nenhuma Sprint será considerada concluída sem todas essas etapas.