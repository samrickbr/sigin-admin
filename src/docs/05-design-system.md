# Design System SIGIN Front

## Objetivo

Definir a base visual, os padrões de interface e os componentes reutilizáveis do Frontend Administrativo do SIGIN.

O Design System deve garantir consistência visual entre os módulos e permitir evolução incremental sem duplicação de componentes ou estilos.

---

# Tema

O SIGIN utiliza:

* Material UI;
* Dark Theme;
* Tokens visuais centralizados;
* Configuração global através do Theme.

Localização:

```text
src/styles/
```

---

# Estrutura de estilos

```text
src/styles/
├── colors.ts
├── typography.ts
├── radius.ts
├── spacing.ts
├── shadows.ts
├── theme.ts
├── ThemeProvider.tsx
└── index.ts
```

Os tokens devem permanecer centralizados e ser reutilizados pelos componentes e módulos.

---

# Material UI

Os componentes nativos do Material UI devem ser utilizados sempre que atenderem ao requisito da interface.

A configuração visual global deve ser realizada preferencialmente através do Theme.

Componentes atualmente contemplados pelo Theme incluem:

* Button;
* TextField;
* Card;
* Dialog;
* Alert;
* Table;
* demais componentes necessários à evolução do Backoffice.

Não devem ser criados wrappers próprios apenas para substituir componentes nativos sem necessidade real.

---

# Componentes Próprios

Componentes próprios devem existir quando houver comportamento ou padrão específico do SIGIN que justifique sua reutilização.

---

## Common

Localização:

```text
src/components/common/
```

Componentes:

* Loading;
* EmptyState;
* Feedback;
* ConfirmDialog.

Esses componentes devem ser reutilizados pelos módulos administrativos sempre que o comportamento necessário for atendido.

---

## Table

Localização:

```text
src/components/table/
```

Componentes:

* DataTable.

O `DataTable` fornece o padrão compartilhado para apresentação de dados tabulares no Backoffice.

---

## Forms

Localização:

```text
src/components/forms/
```

Componentes:

* FormError.

---

# Layout

Os elementos estruturais do Backoffice permanecem centralizados na camada de layout:

```text
src/components/layout/
├── Header.tsx
├── MainLayout.tsx
└── Sidebar.tsx
```

O layout deve ser reutilizado pelas páginas administrativas e não duplicado dentro dos módulos.

---

# Formulários

O padrão adotado para formulários é:

* React Hook Form;
* Zod;
* `zodResolver`.

Responsabilidades do Front:

* validação de experiência do usuário;
* apresentação de mensagens de erro;
* controle dos estados do formulário;
* integração com as APIs do Core.

As regras de negócio permanecem sob responsabilidade do Core.

O Front não deve duplicar validações de negócio como substituição das validações realizadas pelo backend.

---

# Tipografia e Layout

As regras visuais devem utilizar os tokens e configurações centralizadas do Design System.

No uso do Material UI, propriedades de layout e apresentação devem seguir o padrão estabelecido pelo projeto.

Quando aplicável, propriedades visuais e de layout devem ser concentradas em `sx` em vez de utilizar propriedades não suportadas diretamente pelo componente.

---

# Regras de Reutilização

Antes de criar um componente:

1. verificar se já existe componente equivalente;
2. verificar se um componente existente pode ser reutilizado;
3. verificar se o componente existente pode ser evoluído;
4. somente então criar um novo componente.

É proibido duplicar componentes que já atendam ao requisito.

---

# Regras

* Componentes Material UI devem ser preferencialmente configurados através do Theme.
* Componentes próprios devem ser criados somente quando houver comportamento ou padrão específico do SIGIN.
* Componentes compartilhados devem permanecer em `src/components/`.
* Componentes específicos de um módulo devem permanecer dentro do respectivo módulo.
* Não duplicar componentes existentes.
* Não criar abstrações apenas por preferência técnica.
* Priorizar evolução antes de substituição.
* Manter consistência visual entre os módulos do Backoffice.
* Novos componentes devem considerar possibilidade de reutilização futura.

---

# Evolução

O Design System deve permanecer independente das regras de negócio dos módulos.

Sua evolução deverá considerar a reutilização pelos módulos atuais e futuros, incluindo:

* Dashboard;
* Pessoas;
* Usuários;
* Perfis;
* Produtos;
* Categorias;
* Canais de Venda;
* Financeiro;
* Produção;
* Delivery;
* PDV;
* Comanda;
* Configurações;
* demais módulos futuros.
