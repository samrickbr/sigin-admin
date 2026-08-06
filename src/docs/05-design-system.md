# Design System SIGIN Front

## Objetivo

Definir a base visual e componentes reutilizáveis do Frontend Administrativo SIGIN.

---

# Tema

O SIGIN utiliza:

- Material UI
- Dark Theme
- Tokens centralizados

Local:

--- 

src/styles

---

# Estrutura de estilos

styles/
├── colors.ts
├── typography.ts
├── radius.ts
├── spacing.ts
├── shadows.ts
└── theme.ts


---

# Componentes MUI

Componentes nativos são configurados através do Theme:

- Button
- TextField
- Card
- Dialog
- Alert
- Table

Não são criados wrappers sem necessidade.

---

# Componentes próprios

## Common


components/common


Componentes:

- Loading
- EmptyState
- Feedback
- ConfirmDialog

---

## Table


components/table


Componentes:

- DataTable

---

## Forms


components/forms


Componentes:

- FormError

---

# Formulários

Padrão:

- React Hook Form
- Zod
- zodResolver

Responsabilidades:

- validação de campos;
- mensagens de erro;
- integração com APIs.

---

# Regras

- Componentes MUI devem ser preferencialmente configurados via Theme.
- Criar componentes próprios somente quando houver comportamento específico SIGIN.
- Não duplicar componentes.