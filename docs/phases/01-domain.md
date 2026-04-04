# Fase 1 — Domain: Cliente

## Objetivo

Construir a camada de domínio da funcionalidade de **Clientes**: entidade, Value Objects, enums e interface de repositório. Todo o código produzido deve ser puro — sem dependência de framework, ORM ou infraestrutura (ver `.copilot/rules/domain-instruction.md`).

---

## Contexto e nuances da funcionalidade

Um **Cliente** pertence a uma empresa (multi-tenant). O cliente pode ser pessoa física (**PF**) ou pessoa jurídica (**PJ**), e o tipo determina qual documento de identificação é obrigatório — CPF para PF e CNPJ para PJ. Os dois documentos nunca coexistem no mesmo cliente.

O endereço é obrigatório e composto por múltiplos campos (CEP, Rua, Bairro, Número, Complemento opcional, Cidade e Estado). Ele é tratado como um **Value Object** porque não possui identidade própria e é sempre definido pelo conjunto dos seus valores.

A remoção de um cliente é permanente (hard delete) e deve eliminar em cascata todas as suas subscriptions — essa responsabilidade é da camada de infraestrutura, mas o contrato do repositório deve expô-la.

---

## Value Objects

### Reaproveitar (já implementados)

| Value Object | Arquivo | Uso |
|---|---|---|
| `CnpjValueObject` | `value-objects/cnpj/cnpj.ts` | Documento do cliente PJ |
| `EmailValueObject` | `value-objects/email/email.ts` | Email do responsável |
| `PhoneValueObject` | `value-objects/phone/phone.ts` | Telefone (opcional) |

---

### Criar: `CpfValueObject`

Gerar testes unitário primeiro seguindo as diretrizes de TDD [ver `./copilot/rules/testing-instruction.md` *focando apenas no tópico Testes Unitários*]

* **Arquivo de Teste**: `test/unit/domain/value-objects/cpf.test.ts`

* **Arquivo de implementação:** `src/domain/value-objects/cpf/cpf.ts`

**Responsabilidades:**
- Aceitar CPF com ou sem máscara (`000.000.000-00` ou `00000000000`)
- Limpar e armazenar apenas os 11 dígitos numéricos
- Validar comprimento exato de 11 dígitos
- Rejeitar sequências com todos os dígitos iguais (ex: `111.111.111-11`)

**Invariantes (lança `Error`):**

| Condição | Mensagem |
|---|---|
| Valor vazio ou nulo | `"CPF é obrigatório"` |
| Diferente de 11 dígitos | `"CPF deve conter exatamente 11 dígitos numéricos"` |
| Sequência repetida ou dígito verificador inválido | `"CPF inválido"` |

---

### Criar: `AddressValueObject`
Gerar testes unitário primeiro seguindo as diretrizes de TDD [ver `./copilot/rules/testing-instruction.md` *focando apenas no tópico Testes Unitários*]

* **Arquivo de teste**: `test/unit/domain/value-objects/address.test.ts`
* **Arquivo de implementação:** `src/domain/value-objects/address/address.ts`

**Props:**

| Campo | Tipo | Obrigatoriedade |
|---|---|---|
| `cep` | `string` | Obrigatório — 8 dígitos numéricos |
| `street` | `string` | Obrigatório |
| `neighborhood` | `string` | Obrigatório |
| `number` | `string` | Obrigatório |
| `complement` | `string \| null` | Opcional |
| `city` | `string` | Obrigatório |
| `state` | `string` | Obrigatório — UF com 2 letras maiúsculas |

**Invariantes (lança `Error`):**

| Condição | Mensagem |
|---|---|
| `cep` vazio | `"CEP é obrigatório"` |
| `cep` com diferente de 8 dígitos numéricos | `"CEP inválido"` |
| `street` vazio | `"Rua é obrigatória"` |
| `neighborhood` vazio | `"Bairro é obrigatório"` |
| `number` vazio | `"Número é obrigatório"` |
| `city` vazia | `"Cidade é obrigatória"` |
| `state` vazio | `"Estado é obrigatório"` |
| `state` não é UF válida de 2 letras | `"Estado inválido"` |

O VO é **imutável** — todos os campos são `readonly`. O `complement` pode ser `null`.

---

## Entidade: `Client`

Gerar testes unitário primeiro seguindo as diretrizes de TDD [ver `./copilot/rules/testing-instruction.md` *focando apenas no tópico Testes Unitários*]

**Arquivo de teste:** `test/unit/domain/client.test.ts`
* **Arquivo de implementação:** `src/domain/entities/client/client.ts`*

### Props de entrada

```typescript
type ClientProps = {
  id: string
  name: string
  companyName: string | null   // nome da empresa do cliente (opcional)
  email: string
  type: EClientType                  // PF | PJ
  cpf: string | null                 // obrigatório se type = PF
  cnpj: string | null                // obrigatório se type = PJ
  phone: string | null               // opcional
  address: AddressProps              // todos os campos de endereço
  companyId: string                  // empresa a qual o cliente pertence
  userId: string                     // userId de quem cadastrou
  dtCreatedAt?: Date
  dtUpdatedAt?: Date | null
}
```

### Campos internos (privados)

| Campo | Tipo |
|---|---|
| `id` | `string` |
| `name` | `string` |
| `companyName` | `string \| null` |
| `email` | `EmailValueObject` |
| `type` | `EClientType` |
| `cpf` | `CpfValueObject \| null` |
| `cnpj` | `CnpjValueObject \| null` |
| `phone` | `PhoneValueObject \| null` |
| `address` | `AddressValueObject` |
| `companyId` | `string` |
| `userId` | `string` |
| `dtCreatedAt` | `Date` |
| `dtUpdatedAt` | `Date \| null` |

### Regras e invariantes no construtor

| # | Condição | Mensagem de erro |
|---|---|---|
| 1 | `id` ausente | `"ID é obrigatório"` |
| 2 | `name` ausente | `"Nome é obrigatório"` |
| 3 | `email` ausente | `"Email é obrigatório"` |
| 4 | `type` ausente | `"Tipo é obrigatório"` |
| 5 | `type` diferente de `PF` ou `PJ` | `"Tipo inválido"` |
| 6 | `companyId` ausente | `"companyId é obrigatório"` |
| 7 | `userId` ausente | `"userId é obrigatório"` |
| 8 | `type = PF` e `cpf` nulo | `"CPF é obrigatório para clientes do tipo PF"` |
| 9 | `type = PJ` e `cnpj` nulo | `"CNPJ é obrigatório para clientes do tipo PJ"` |
| 10 | `type = PF` e `cnpj` presente | `"Cliente do tipo PF não deve ter CNPJ"` |
| 11 | `type = PJ` e `cpf` presente | `"Cliente do tipo PJ não deve ter CPF"` |
| 12 | `address` inválido | Delegado ao `AddressValueObject` |


### Getters

`getId()`, `getName()`, `getCompanyClientName()`, `getEmail()`, `getType()`, `getCpf()`, `getCnpj()`, `getPhone()`, `getAddress()`, `getTenantId()`, `getRegisteredBy()`, `getDtCreatedAt()`, `getDtUpdatedAt()`

---

## Interface de Repositório: `ClientRepository`

**Arquivo:** `src/domain/repositories/client.repository.ts`

```typescript
export abstract class ClientRepository {
  abstract create(client: Client): Promise<void>
  abstract findById(id: string): Promise<Client | null>
  abstract findByCpfAndCompanyId(cpf: string, companyId: string): Promise<Client | null>
  abstract findByCnpjAndCompanyId(cnpj: string, companyId: string): Promise<Client | null>
}
```

> `findByCpfAndCompanyId` e `findByCnpjAndCompanyId` são os contratos usados para checar unicidade de documento por empresa — a validação ocorre no Use Case ou Domain Service.

---

## Consolidação das regras de negócio

| # | Regra | Responsável |
|---|---|---|
| 1 | CPF obrigatório quando `type = PF` | `Client` (construtor) |
| 2 | CNPJ obrigatório quando `type = PJ` | `Client` (construtor) |
| 3 | CPF e CNPJ são mutuamente exclusivos | `Client` (construtor) |
| 4 | CPF deve ser válido (algoritmo RF) | `CpfValueObject` |
| 5 | CNPJ deve ser válido (algoritmo RF) | `CnpjValueObject` (existente) |
| 6 | Email deve ter formato válido | `EmailValueObject` (existente) |
| 7 | Telefone deve ser válido se informado | `PhoneValueObject` (existente) |
| 8 | Endereço completo com CEP e UF válidos | `AddressValueObject` |
| 9 | CPF/CNPJ únicos dentro da empresa | `ClientRepository` (contrato) — checado no Use Case |


---

## Artefatos de saída

```
src/domain/
├── value-objects/
│   ├── cpf/
│   │   └── cpf.ts               ← NOVO
│   └── address/
│       └── address.ts           ← NOVO
├── entities/
│   └── client/
│       └── client.ts            ← NOVO
└── repositories/
    └── client.repository.ts     ← NOVO
```

## Regras obrigatórias
- Seguir `.copilot/rules/domain-instruction.md`
- Construtor privado — instanciar apenas via `static create(props)`
- Zero imports de framework, ORM ou `src/shared/`
- Toda validação lança `Error` nativo (sem exceções de HTTP neste escopo)
