# Plano de Desenvolvimento Detalhado — Evolution CRM

> Expansão da visão de cada fase definida em `high-level-plan.md`.
> Este documento serve como **todo-list de desenvolvimento** por fase, controlando o progresso de cada ponto a ser implementado.
>
> Legenda: `[ ]` pendente · `[x]` concluído

---

## Fase 0 — Base da Aplicação ✅ Concluída

### Autenticação
- [x] Cadastro de usuário (nome, sobrenome, email único, telefone opcional, senha)
- [x] Validação de unicidade de email no sistema
- [x] Login com email e senha (erro genérico para credenciais inválidas)
- [x] Geração de token JWT com validade de 7 dias
- [x] Guard de autenticação aplicado globalmente (rotas públicas marcadas explicitamente)

### Usuário
- [x] Entidade User com campos obrigatórios e opcionais
- [x] Repositório e implementação de persistência de User
- [x] Rota de perfil do usuário autenticado (`GET /v1/users/me`)

### Cliente (parcial)
- [x] Entidade Client com dados pessoais e endereço
- [x] Value Object CPF/CNPJ com validação
- [x] Value Object Email com validação
- [x] Value Object Phone com validação
- [x] Criação de cliente (`POST /v1/clients`)

### Infraestrutura
- [x] ORM configurado (MikroORM)
- [x] Serviço de hash de senha (bcrypt)
- [x] Serviço de geração de token (JWT)
- [x] Migrations iniciais criadas

---

## Fase 1 — Empresa & Multi-tenancy

### Domínio
- [ ] Definir campos da entidade Company: nome fantasia, razão social, CNPJ, telefone (opcional)
- [ ] Validação de CNPJ único no sistema
- [ ] Relacionamento `User → Company` (1 usuário possui 1 empresa)

### Persistência
- [ ] Entidade ORM de Company
- [ ] Migration adicionando tabela `companies` e chave estrangeira em `users`
- [ ] Repositório de Company com método de busca por CNPJ

### API
- [ ] Endpoint de criação de empresa (`POST /v1/companies`)
  - Somente o usuário autenticado pode criar sua própria empresa
  - Validação: usuário já com empresa cadastrada deve ser recusado
  - Validação: CNPJ único no sistema

### Multi-tenancy
- [ ] Extrair `companyId` do usuário autenticado em todos os contextos de escrita e leitura
- [ ] Garantir que nenhuma consulta de dados de negócio (clientes, planos, cupons, subscriptions) retorne dados fora da empresa do usuário autenticado
- [ ] Atualizar a criação de cliente (Fase 0) para vincular ao `companyId` correto

---

## Fase 2 — RBAC: Sistema de Permissões

### Guard e Decorators
- [ ] Decorator `@Roles(...)` para marcar permissões exigidas por rota
- [ ] `RolesGuard` que valida a role do usuário autenticado contra as permissões da rota
- [ ] Integração do `RolesGuard` com o guard de autenticação já existente

### Rastreamento de Autoria
- [ ] Campo `createdBy` (referência ao usuário) nas entidades Client, Coupon e Subscription
- [ ] Lógica de verificação: OPERATOR só pode editar/cancelar registros onde `createdBy === userId`

### Aplicação nas Rotas Existentes
- [ ] Aplicar roles na rota de criação de cliente (ADMIN e OPERATOR)
- [ ] Aplicar roles nas rotas de User já existentes

### Gerenciamento de Usuários Internos (exclusivo ADMIN)
- [ ] Convidar/criar usuário interno da empresa com role definida (ADMIN, SUPERVISOR, OPERATOR)
  - Validação: email único no sistema
  - O usuário criado recebe automaticamente vínculo com a empresa do ADMIN
- [ ] Editar dados e role de um usuário interno
- [ ] Remover usuário interno da empresa
- [ ] Listar usuários internos da empresa

---

## Fase 3A — Clientes: CRUD Completo

> *Pode ser desenvolvida em paralelo com a Fase 3B*

### Listagem
- [ ] Endpoint de listagem de clientes da empresa (`GET /v1/clients`)
  - Acessível por ADMIN, SUPERVISOR e OPERATOR
  - Retorna apenas clientes da empresa do usuário autenticado

### Edição
- [ ] Endpoint de edição de cliente (`PUT /v1/clients/:id`)
  - ADMIN: pode editar qualquer cliente
  - OPERATOR: pode editar apenas clientes que ele cadastrou (`createdBy`)
  - SUPERVISOR: não pode editar
  - Revalidação de unicidade de CPF/CNPJ dentro da empresa ao alterar documento

### Remoção
- [ ] Endpoint de remoção de cliente (`DELETE /v1/clients/:id`)
  - Somente ADMIN
  - Hard delete do cliente
  - Remoção em cascata de todas as subscriptions do cliente

### Regras Gerais de Cliente
- [ ] Garantir que CPF ou CNPJ seja único dentro da empresa (não globalmente)
- [ ] Validação de tipo: CPF obrigatório para PF; CNPJ obrigatório para PJ
- [ ] Endereço completo obrigatório: CEP, rua, bairro, número, cidade, estado (UF)

---

## Fase 3B — Planos: CRUD Completo

> *Pode ser desenvolvida em paralelo com a Fase 3A*

### Domínio
- [ ] Definir entidade Plan: nome, descrição (opcional), valor em centavos, status (Ativo/Inativo), recorrência (Mensal/Trimestral/Anual)
- [ ] Enum de recorrência: `MONTHLY`, `QUARTERLY`, `ANNUAL`
- [ ] Repositório de Plan com método para verificar existência de subscriptions ativas vinculadas

### API
- [ ] Criar plano (`POST /v1/plans`) — somente ADMIN
- [ ] Editar plano (`PUT /v1/plans/:id`) — somente ADMIN
  - Inativar plano não cancela subscriptions existentes
- [ ] Remover plano (`DELETE /v1/plans/:id`) — somente ADMIN
  - Recusado se o plano possuir subscriptions ativas
- [ ] Listar planos da empresa (`GET /v1/plans`) — ADMIN, SUPERVISOR, OPERATOR

---

## Fase 4 — Cupons

### Domínio
- [ ] Definir entidade Coupon: nome descritivo, plano associado, percentual de desconto (1–100), quantidade disponível
- [ ] Repositório de Coupon com método para verificar associação com subscriptions

### API
- [ ] Criar cupom (`POST /v1/coupons`) — ADMIN e OPERATOR
  - Cupom obrigatoriamente vinculado a um plano da empresa
  - Percentual entre 1 e 100
  - Quantidade disponível é inteiro positivo
- [ ] Editar cupom (`PATCH /v1/coupons/:id`) — ADMIN; OPERATOR somente os que criou
  - Editar a quantidade disponível não afeta usos já registrados
- [ ] Remover cupom (`DELETE /v1/coupons/:id`) — somente ADMIN
  - Recusado se o cupom estiver associado a alguma subscription
- [ ] Listar cupons da empresa (`GET /v1/coupons`) — ADMIN, SUPERVISOR, OPERATOR

---

## Fase 5 — Subscriptions (Assinaturas)

### Domínio
- [ ] Definir entidade Subscription: cliente, plano, data início, data fim (opcional), cupom (opcional), valor final em centavos
- [ ] Lógica de cálculo do valor final: `valor do plano - (valor do plano × percentual do cupom / 100)`
- [ ] Repositório de Subscription com métodos: listar por cliente, listar por plano, verificar subscriptions ativas de um plano

### Criação
- [ ] Endpoint de criação de subscription (`POST /v1/clients/:clientId/subscriptions`) — ADMIN e OPERATOR
  - Validação: cliente e plano pertencem à mesma empresa
  - Validação: cupom (se informado) está vinculado ao plano da subscription
  - Validação: cota do cupom maior que zero
  - Cálculo automático do valor final com desconto aplicado
  - Decremento da quantidade disponível do cupom em 1

### Cancelamento
- [ ] Endpoint de cancelamento de subscription (`DELETE /v1/clients/:clientId/subscriptions/:id`)
  - ADMIN: pode cancelar qualquer subscription
  - OPERATOR: pode cancelar apenas as que criou (`createdBy`)
  - SUPERVISOR: não pode cancelar
  - Hard delete — não restitui a cota do cupom utilizado

### Listagem
- [ ] Endpoint de listagem de subscriptions de um cliente (`GET /v1/clients/:clientId/subscriptions`)
  - Acessível por ADMIN, SUPERVISOR e OPERATOR
  - Retorna apenas subscriptions da empresa do usuário autenticado

---

## Visão Consolidada do Progresso

| Fase | Status | Qtd itens | Concluídos |
|------|--------|-----------|------------|
| 0 — Base | ✅ Concluída | 14 | 14 |
| 1 — Empresa & Multi-tenancy | ⬜ Pendente | 9 | 0 |
| 2 — RBAC & Permissões | ⬜ Pendente | 11 | 0 |
| 3A — Clientes CRUD | ⬜ Pendente | 8 | 0 |
| 3B — Planos CRUD | ⬜ Pendente | 8 | 0 |
| 4 — Cupons | ⬜ Pendente | 8 | 0 |
| 5 — Subscriptions | ⬜ Pendente | 9 | 0 |
| **Total** | | **67** | **14** |
