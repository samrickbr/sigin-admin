# Changelog — SIGIN Admin Frontend

Todas as alterações relevantes do projeto serão registradas neste arquivo.

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
* Controle granular de permissões preparado, aguardando contrato definitivo do Core.

### Observações

O Core atualmente fornece autenticação através de JWT. A evolução do controle de permissões dependerá da disponibilização de informações de usuário/permissões através do login ou endpoint de sessão.

---

# Próximas versões

## Sprint F02

Design System.

## Sprint F03

Dashboard Administrativo.

## Sprint F04

Módulo Pessoas.
