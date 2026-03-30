# Planejamento Global de Fases — Evolution CRM

## Estado Atual

O projeto já possui uma base funcional implementada:

- ✅ Autenticação completa (cadastro de usuário + login + JWT)
- ✅ Entidade e módulo de User
- ✅ Client — apenas **criação** (edição, remoção e listagem ausentes)
- ✅ Value Objects: Email, Phone, CPF/CNPJ
- ✅ Enum UserRole (ADMIN / SUPERVISOR / OPERATOR) — declarado, mas não aplicado nas rotas
- ✅ Infraestrutura: MikroORM, bcrypt, JWT configurados

---

## Mapa de Dependências entre Fases

```
Fase 0 (Concluída)
    └── Fase 1: Empresa & Multi-tenancy
            └── Fase 2: RBAC & Permissões
                    ├── Fase 3A: Clientes (CRUD completo) + Gerenciamento de Usuários
                    └── Fase 3B: Planos (CRUD completo)
                                        └── Fase 4: Cupons
                                                        └── Fase 5: Subscriptions
```

> **Fases 3A e 3B são independentes entre si** — podem ser desenvolvidas em paralelo após a conclusão da Fase 2.

---

## Fase 0 — Base da Aplicação ✅ Concluída

**Objetivo:** Infraestrutura, autenticação e estrutura base do projeto funcionando.

**O que está feito:**
- Cadastro de usuário (Etapa 1 do fluxo do produto)
- Login com JWT (validade de 7 dias, sem refresh token)
- Entidade e módulo de User
- Criação básica de Cliente
- Value Objects, enums e ORM configurados

---

## Fase 1 — Empresa & Multi-tenancy

**Objetivo:** Completar o cadastro em 2 etapas previsto no produto e garantir o isolamento total de dados por empresa.

**Escopo:**
- Entidade `Company` com: nome fantasia, razão social, CNPJ (único e válido), telefone
- Vinculação `User → Company`
- Endpoint para criação da empresa (somente pelo usuário autenticado, para si mesmo — Etapa 2 do cadastro)
- Aplicação do contexto de empresa em todos os módulos: toda consulta filtra por `companyId`

**Depende de:** Fase 0
**Desbloqueia:** Fase 2

---

## Fase 2 — RBAC: Sistema de Permissões

**Objetivo:** Implementar e aplicar o modelo de permissões definido no produto (ADMIN / SUPERVISOR / OPERATOR) em todas as rotas.

**Escopo:**
- Guard de roles com decorator `@Roles(...)`
- Aplicação nas rotas de User e Client já existentes, e nas futuras
- Rastreamento de autoria (`createdBy`) nas entidades onde OPERATOR tem restrição de escrita própria
- Gerenciamento de usuários internos da empresa: criar, editar, remover (exclusivo do ADMIN)

**Depende de:** Fase 1 (precisa do contexto de empresa para escopo dos usuários internos)
**Desbloqueia:** Fase 3A e Fase 3B (podem ser desenvolvidas em paralelo)

---

## Fase 3A — Clientes: CRUD Completo

**Objetivo:** Completar todas as ações sobre clientes previstas no produto.

**Escopo:**
- Listagem de clientes da empresa
- Edição de cliente (ADMIN sem restrição; OPERATOR somente os que cadastrou)
- Remoção de cliente — hard delete (somente ADMIN, com remoção em cascata das subscriptions)
- CPF/CNPJ único dentro da empresa
- Isolamento multi-tenant aplicado

**Depende de:** Fase 2
**Paralela com:** Fase 3B
**Desbloqueia:** Fase 5

---

## Fase 3B — Planos: CRUD Completo

**Objetivo:** Implementar o módulo de planos da empresa.

**Escopo:**
- Entidade `Plan` com: nome, descrição, valor em centavos, status (Ativo/Inativo), recorrência (Mensal/Trimestral/Anual)
- CRUD completo: criar, editar, remover, listar
- Regra: plano só pode ser removido se não tiver subscriptions ativas
- Inativar um plano não cancela subscriptions existentes; apenas impede novas associações

**Depende de:** Fase 2
**Paralela com:** Fase 3A
**Desbloqueia:** Fase 4

---

## Fase 4 — Cupons

**Objetivo:** Implementar o módulo de cupons de desconto vinculados a planos específicos.

**Escopo:**
- Entidade `Coupon` com: nome descritivo, plano associado, percentual de desconto (1–100), quantidade disponível
- CRUD completo: criar, editar, remover, listar
- Regra: cupom só pode ser removido se não estiver associado a nenhuma subscription
- Editar a quantidade disponível não afeta usos já registrados

**Depende de:** Fase 3B (cupom obrigatoriamente vinculado a um plano)
**Desbloqueia:** Fase 5

---

## Fase 5 — Subscriptions (Assinaturas)

**Objetivo:** Implementar a entidade central que conecta Cliente ↔ Plano, com suporte a cupons e controle de período.

**Escopo:**
- Entidade `Subscription` com: cliente, plano, data de início, data de fim (opcional), cupom (opcional), valor final calculado
- Criação: cálculo automático do valor final (valor do plano com desconto do cupom aplicado)
- Cupom aplicado apenas na criação; não pode ser alterado depois
- Decremento de cota do cupom no momento da criação; cota esgotada recusa a subscription
- Cancelamento — hard delete (ADMIN sem restrição; OPERATOR somente as que criou)
- Cancelar subscription não restitui a cota do cupom utilizado
- Listagem (acessível a todos os roles)

**Depende de:** Fase 3A (clientes), Fase 3B (planos), Fase 4 (cupons)
**É a fase final do produto**

---

## Resumo das Fases

| Fase | Módulo / Foco | Depende de | Paralela com |
|------|---------------|------------|--------------|
| 0 ✅ | Base: Auth, User, Client (create) | — | — |
| 1 | Empresa & Multi-tenancy | 0 | — |
| 2 | RBAC + Gerenciamento de Usuários | 1 | — |
| 3A | Clientes CRUD completo | 2 | 3B |
| 3B | Planos CRUD completo | 2 | 3A |
| 4 | Cupons | 3B | — |
| 5 | Subscriptions | 3A + 3B + 4 | — |
