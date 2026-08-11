# Fluxo de Execução das Sprints — SIGIN Frontend

## Objetivo

Este documento define o modelo oficial de execução das Sprints do Frontend Administrativo do SIGIN.

O objetivo é separar claramente:

* decisões arquiteturais;
* planejamento;
* execução técnica;
* validação;
* documentação.

O Roadmap define.

A Sprint executa.

---

# Modelo de Responsabilidades

## Roadmap Front

Responsável por:

* arquitetura do Frontend;
* decisões técnicas;
* padrões de desenvolvimento;
* definição das Sprints;
* análise de feedbacks;
* evolução do Design System;
* validação das entregas;
* fechamento da Sprint;
* atualização da documentação oficial.

O Roadmap não deve executar alterações de código da Sprint.

---

## Sprint Front

Responsável por:

* implementar as decisões aprovadas;
* alterar código;
* executar testes;
* corrigir problemas encontrados;
* fornecer o resultado da implementação;
* registrar limitações encontradas.

A Sprint não define arquitetura por conta própria.

---

# Executor da Sprint

O Executor é a ferramenta ou agente utilizado como apoio à implementação técnica.

Pode ser utilizado para:

* analisar código fornecido;
* orientar alterações;
* gerar arquivos completos;
* executar comandos quando possuir acesso ao workspace;
* corrigir erros;
* validar funcionamento;
* informar limitações.

Quando o Executor não possuir acesso direto ao workspace, o desenvolvedor deverá fornecer os arquivos ou trechos necessários.

Nesse cenário:

```text
Roadmap
   ↓
Define Sprint
   ↓
Desenvolvedor fornece contexto/arquivos
   ↓
Executor analisa
   ↓
Executor orienta ou fornece arquivos completos
   ↓
Desenvolvedor aplica alterações
   ↓
Testes
   ↓
Roadmap valida e fecha Sprint
```

O Executor não possui autonomia para:

* alterar arquitetura;
* criar regras de negócio;
* substituir padrões definidos;
* modificar decisões do Roadmap;
* criar contratos de API por suposição.

---

# Fonte de Verdade

O repositório Git atual é a fonte primária da verdade estrutural do projeto.

Quando o Executor possuir acesso ao workspace, deverá verificar:

```text
branch atual
↓
git status
↓
estrutura real
↓
arquivos existentes
↓
implementações existentes
↓
dependências
↓
execução da Sprint
```

Quando o Executor não possuir acesso ao workspace, a mesma validação deverá ser realizada através dos arquivos fornecidos pelo desenvolvedor.

Em caso de divergência:

```text
Código atual
    ↑
 prioridade
    ↓
Documentação
    ↓
Memória/conversa
```

A documentação deve ser atualizada posteriormente para refletir o estado real.

---

# Regra de Arquivos

O Executor não deve assumir que um arquivo existe apenas porque:

* foi mencionado em uma Sprint anterior;
* apareceu em uma conversa;
* foi informado por outro agente;
* aparece em documentação desatualizada;
* possui nome semelhante a outro arquivo.

Antes de utilizar um arquivo, sua existência deve ser confirmada.

Se um arquivo mencionado não existir:

1. não criar automaticamente;
2. localizar a implementação equivalente;
3. verificar se ela pode ser reutilizada;
4. informar a divergência;
5. criar nova estrutura somente quando estiver prevista ou aprovada.

---

# Regras de Implementação

Antes de implementar, responder:

* O que já existe?
* O que pode ser reutilizado?
* O que precisa ser evoluído?
* O que realmente precisa ser criado?

Durante a implementação:

* seguir os padrões existentes;
* reutilizar componentes;
* evitar alterações fora do escopo;
* preservar contratos existentes;
* registrar limitações;
* não inventar contratos de API.

---

# Alterações Fora do Escopo

Quando for identificada uma alteração necessária que não pertença claramente à Sprint:

1. parar antes de implementá-la;
2. informar o arquivo afetado;
3. explicar por que a alteração seria necessária;
4. informar o impacto;
5. aguardar decisão do Roadmap.

O desenvolvedor poderá consultar o Roadmap antes de aplicar qualquer alteração fora do escopo.

---

# Execução com Arquivos Fornecidos

Quando o Executor não tiver acesso direto ao computador do desenvolvedor:

* o desenvolvedor poderá enviar arquivos como anexos;
* o Executor deverá trabalhar exclusivamente sobre o conteúdo fornecido;
* não deverá presumir conteúdo de arquivos não enviados;
* quando precisar de outro arquivo, deverá solicitar somente o arquivo necessário;
* alterações em arquivos existentes deverão preferencialmente ser fornecidas como conteúdo completo quando essa for a convenção adotada pelo projeto.

---

# Responsabilidade do Desenvolvedor

O desenvolvedor é responsável por:

* aplicar as alterações sugeridas;
* revisar o código antes de executar;
* executar os comandos no ambiente local;
* executar testes;
* confirmar resultados;
* controlar commit e push.

O Executor pode orientar esses passos, mas não deve assumir que alterações foram aplicadas sem confirmação.

---

# Fechamento da Sprint

Após a implementação:

1. executar testes;
2. executar lint/build quando aplicável;
3. verificar `git diff --check`;
4. verificar `git status`;
5. revisar alterações;
6. atualizar documentação;
7. realizar commit;
8. realizar push;
9. registrar feedback;
10. retornar ao Roadmap.

---

# Commit e Push

O fechamento Git deve ser realizado somente após a validação da Sprint.

A documentação deve fazer parte do fechamento quando houver alterações documentais relacionadas à Sprint.

Arquivos de configuração pessoal de ferramentas, caches ou dados locais não devem ser adicionados ao commit sem decisão explícita.

---

# Comunicação entre Roadmap e Sprint

Toda Sprint deverá possuir:

## Contexto

O que já existe.

## Objetivo

O que deve ser entregue.

## Restrições

O que não pode ser alterado.

## Critérios de Conclusão

Como validar a entrega.

## Feedback

O que foi encontrado durante a implementação e que poderá afetar futuras Sprints.

---

# Fluxo Oficial

```text
Roadmap Front
      ↓
Define Sprint
      ↓
Contexto + Objetivo + Restrições
      ↓
Executor recebe contexto
      ↓
Análise inicial
      ↓
Implementação
      ↓
Testes
      ↓
Validação
      ↓
Documentação
      ↓
Commit
      ↓
Tag
      ↓
Feedback
      ↓
Roadmap Front
```

---

# Alterações Arquiteturais

Caso seja encontrada necessidade arquitetural:

Não implementar automaticamente.

Registrar:

* problema encontrado;
* impacto;
* alternativa;
* recomendação.

Enviar para:

* Roadmap Front; ou
* Roadmap Core, quando envolver contrato ou regra do Core.

---

# Executor Oficial

O executor utilizado em cada Sprint poderá variar conforme a disponibilidade e desempenho das ferramentas.

O projeto poderá utilizar:

* VS Code;
* Continue.dev;
* modelos locais;
* Gemini;
* outros agentes ou ferramentas aprovadas.

A ferramenta utilizada não altera as regras arquiteturais do projeto.

---

# Objetivo do Modelo

Este fluxo permite:

* maior velocidade de desenvolvimento;
* menos retrabalho;
* separação de responsabilidades;
* histórico de decisões;
* evolução controlada do SIGIN;
* rastreabilidade das alterações;
* redução de alterações fora do escopo.

---

# Status

Aprovado.

Aplicado a partir da Sprint F04.
