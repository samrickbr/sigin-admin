# Decisão Técnica 001 — MUI 9 Typography e Props de Sistema

## Contexto

Durante a Sprint F03 foi identificado um problema de tipagem utilizando Material UI 9 com TypeScript.

O uso de propriedades de sistema diretamente em componentes MUI pode gerar conflitos de tipagem e erros de compilação.

---

## Problema identificado

Exemplo que deve ser evitado:

```tsx
<Typography 
  variant="h4"
  fontWeight={700}
  mb={4}
>
```

Esse padrão pode causar erro de tipagem no TypeScript com MUI 9.

---

## Padrão aprovado

Utilizar sempre a propriedade `sx` para propriedades visuais e de layout.

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

Exemplos:

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

---

## Abrangência

Esta decisão vale para todo o Frontend Administrativo SIGIN.

Aplicar em:

* Typography;
* Box;
* Stack;
* Paper;
* Card;
* demais componentes MUI.

---

## Motivo

* Compatibilidade com MUI 9;
* Melhor previsibilidade do TypeScript;
* Padronização do código;
* Redução de erros durante evolução do Design System.

---

## Status

Aprovado.

Aplicar nas próximas Sprints.
