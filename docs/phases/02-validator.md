# Fase 2 — Validator: Cliente

## Objetivo

Implementar a camada de validação da funcionalidade de **Clientes**: o `ClientValidator` responsável por verificar unicidade de CPF e CNPJ antes de operações de criação. Todo o código produzido deve seguir as diretrizes de `src/applications/validator/` (ver `.copilot/rules/validator-instruction.md`).

---

## Contexto

O `ClientValidator` valida pré-condições assíncronas que consultam o repositório antes de Use Cases serem executados. Ele **não orquestra fluxo, não persiste dados e não transforma entidades**.

Os testes em `tests/unit/validator/client.validator.test.ts` já estão escritos e definem o contrato esperado da implementação.

---

## Diagnóstico do Estado Atual

| Artefato | Estado |
|---|---|
| `src/applications/validator/client/client.validator.ts` | Arquivo existe, mas está **vazio** |
| `ClientValidator` no `ValidatorModule` | **Não registrado** |
| `ClientRepository.findByCpf` | **Existe** — repositório possui `findByCpf` recebendo 2 parâmetros (cpf e companyId) |
| `ClientRepository.findByCnpj` | **Existe** — repositório possui `findByCnpj` recebendo 2 parâmetros (cnpj e companyId) |

---

## Fases de Implementação


### Fase 2.1 — Implementar o `ClientValidator`

> **Arquivo:** `src/applications/validator/client/client.validator.ts`

Implementar a classe com base no contrato definido pelos testes.

**Métodos esperados:**

| Método | Comportamento quando encontrado | Comportamento quando não encontrado |
|---|---|---|
| `existByCpf(cpf: string): Promise<void>` | Lança `ConflictException("Já existe um cliente com esse CPF")` | Retorna `void` |
| `existByCnpj(cnpj: string): Promise<void>` | Lança `ConflictException("Já existe um cliente com esse CNPJ")` | Retorna `void` |

**Estrutura esperada:**

```typescript
import { ConflictException, Injectable } from "@nestjs/common";
import { ClientRepository } from "src/domain/repositories/client.repository";

@Injectable()
export class ClientValidator {
  constructor(private readonly clientRepository: ClientRepository) {}

  async existByCpf(cpf: string): Promise<void> {
    const client = await this.clientRepository.findByCpf(cpf);
    if (client) {
      throw new ConflictException("Já existe um cliente com esse CPF");
    }
  }

  async existByCnpj(cnpj: string): Promise<void> {
    const client = await this.clientRepository.findByCnpj(cnpj);
    if (client) {
      throw new ConflictException("Já existe um cliente com esse CNPJ");
    }
  }
}
```

---

### Fase 2.2 — Registrar no `ValidatorModule`

> **Arquivo:** `src/applications/validator/validator.module.ts`

Adicionar o `ClientValidator` em `providers` e `exports`:

```typescript
import { ClientValidator } from "./client/client.validator";

@Module({
  providers: [UserValidator, AuthValidator, CompanyValidator, ClientValidator, ...],
  exports:   [UserValidator, AuthValidator, CompanyValidator, ClientValidator, ...],
})
export class ValidatorModule {}
```

---

### Fase 2.3 — Executar os testes

> **Arquivo de teste:** `tests/unit/validator/client.validator.test.ts`

Rodar os testes para confirmar que todos os 4 casos passam:

```bash
npx jest tests/unit/validator/client.validator.test.ts
```

Casos de teste cobertos:

| # | Descrição | Resultado esperado |
|---|---|---|
| 1 | CPF não cadastrado → `existByCpf` | `resolves.toBeUndefined()` |
| 2 | CPF já cadastrado → `existByCpf` | `rejects.toThrow(ConflictException)` com mensagem correta |
| 3 | CNPJ não cadastrado → `existByCnpj` | `resolves.toBeUndefined()` |
| 4 | CNPJ já cadastrado → `existByCnpj` | `rejects.toThrow(ConflictException)` com mensagem correta |

---

## Checklist de Implementação

- [ ] **2.1** Implementar `ClientValidator` com `existByCpf` e `existByCnpj`
- [ ] **2.2** Registrar `ClientValidator` em `ValidatorModule` (providers + exports)
- [ ] **2.3** Todos os 4 testes de `client.validator.test.ts` passando
