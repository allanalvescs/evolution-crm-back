# Fase 02 — Validator Layer: Resumo Estruturado

> **Projeto:** Evolution CRM — Back-end
> **Camada:** Application / Validator
> **Padrão:** Clean Architecture — validações assíncronas reutilizáveis, desacopladas dos Use Cases

---

## 1. Validators Implementados

### 1.1 `ClientValidator`

**Arquivo:** `src/applications/validator/client/client.validator.ts`

Responsável por validar pré-condições assíncronas relacionadas à unicidade de documentos de clientes antes de operações de criação.

| Método | Parâmetros | Retorno | Comportamento |
|---|---|---|---|
| `existByCpf` | `cpf: string, companyId: string` | `Promise<void>` | Lança `ConflictException` se CPF já estiver cadastrado na empresa |
| `existByCnpj` | `cnpj: string, companyId: string` | `Promise<void>` | Lança `ConflictException` se CNPJ já estiver cadastrado na empresa |

**Exceções lançadas:**

| Situação | Tipo | Mensagem |
|---|---|---|
| CPF já cadastrado | `ConflictException` (HTTP 409) | `"Já existe um cliente com esse CPF"` |
| CNPJ já cadastrado | `ConflictException` (HTTP 409) | `"Já existe um cliente com esse CNPJ"` |

---

## 2. Alterações em Contratos de Repositório

### `ClientRepository`

**Arquivo:** `src/domain/repositories/client.repository.ts`

Foram ajustadas as assinaturas de `findByCpf` e `findByCnpj` para receber um objeto com `companyId` opcional, suportando tanto buscas escopadas por empresa (multi-tenancy) quanto buscas globais. O `ClientValidator` sempre passa o `companyId`, garantindo que a unicidade seja verificada dentro do escopo da empresa.

| Método | Assinatura | Finalidade |
|---|---|---|
| `findByCpf` | `findByCpf({ cpf, companyId? }): Promise<Client \| null>` | Busca por CPF com escopo opcional de empresa |
| `findByCnpj` | `findByCnpj({ cnpj, companyId? }): Promise<Client \| null>` | Busca por CNPJ com escopo opcional de empresa |

---

## 3. Registro no `ValidatorModule`

**Arquivo:** `src/applications/validator/validator.module.ts`

`ClientValidator` foi adicionado a `providers` e `exports`, tornando-o disponível para injeção em qualquer Use Case que importe o `ValidatorModule`.

```typescript
providers: [UserValidator, AuthValidator, CompanyValidator, ClientValidator, ...],
exports:   [UserValidator, AuthValidator, CompanyValidator, ClientValidator, ...],
```

---

## 4. Testes Criados

**Arquivo:** `tests/unit/validator/client.validator.test.ts`

Testes unitários com isolamento completo via mock do repositório. Todos os 4 casos passam.

| # | Descrição | Cenário | Resultado esperado |
|---|---|---|---|
| 1 | CPF não cadastrado na empresa | `findByCpf` retorna `null` | `resolves.toBeUndefined()` |
| 2 | CPF já cadastrado na empresa | `findByCpf` retorna entidade | `rejects.toThrow(ConflictException)` com mensagem correta |
| 3 | CNPJ não cadastrado na empresa | `findByCnpj` retorna `null` | `resolves.toBeUndefined()` |
| 4 | CNPJ já cadastrado na empresa | `findByCnpj` retorna entidade | `rejects.toThrow(ConflictException)` com mensagem correta |

**Estratégia de mock:**

```typescript
const mockClientRepository = {
  findByCpf: jest.fn(),
  findByCnpj: jest.fn(),
};
```

As chamadas verificam que o repositório recebe o objeto correto com `companyId`:

```typescript
expect(mockClientRepository.findByCpf).toHaveBeenCalledWith({
  cpf: "52998224725",
  companyId: "uuid-company-001",
});
```

---

## 5. Decisões Arquiteturais

### 5.1 Validator retorna `void`, nunca dados
Ambos os métodos retornam `Promise<void>`. Quando a validação passa, não há retorno — o fluxo do Use Case simplesmente continua. Isso mantém os validators coesos: sua única responsabilidade é bloquear quando há violação.

### 5.2 Unicidade escopada por empresa (multi-tenancy)
A validação de unicidade de CPF/CNPJ é escopada por `companyId`. Um mesmo documento pode existir em empresas diferentes — o que não pode é existir duas vezes na **mesma empresa**. O `ClientValidator` sempre recebe e repassa o `companyId`, e o contrato do repositório aceita `companyId` como parâmetro opcional para permitir reuso em outros contextos.

### 5.3 Dependência apenas de contrato de domínio
`ClientValidator` importa exclusivamente `ClientRepository` (abstract class do domínio). Nenhuma dependência de ORM, módulo de infraestrutura ou serviço concreto. Isso garante testabilidade total e respeita a regra de dependência da arquitetura limpa.

### 5.4 Um Validator por domínio, múltiplos métodos
Em vez de criar `ExistByCpfValidator` e `ExistByCnpjValidator` separados, ambas as validações vivem em `ClientValidator`. Seguindo a diretriz da camada: um validator por domínio, com múltiplos métodos agrupados.

### 5.5 `ConflictException` como exceção semântica
HTTP 409 Conflict é o código correto para violações de unicidade. O NestJS serializa automaticamente a exceção para o formato padrão de resposta de erro (`{ statusCode, message }`).

---

## 6. Pontos de Atenção

| # | Ponto | Descrição |
|---|---|---|
| 1 | **CPF não é revalidado no Validator** | O `ClientValidator` recebe o CPF como string primitiva e repassa diretamente ao repositório. A validação de formato/dígitos verificadores é responsabilidade do `CpfValueObject` na camada de domínio, que será acionado na criação da entidade. |
| 2 | **Índices por `companyId + cpf/cnpj`** | As buscas são filtradas por empresa. Em produção, o índice ideal é composto: `(company_id, cpf)` e `(company_id, cnpj)`, não apenas nas colunas de documento isoladas. |
| 3 | **`companyId` opcional no repositório** | O parâmetro `companyId` é `optional` no contrato do repositório (`companyId?`), o que permite buscas globais em outros contextos. O `ClientValidator` sempre o fornece, mas consumidores futuros devem estar cientes da semântica de cada cenário. |
| 4 | **CPF inválido no fixture do teste** | O `makeClient` original usava `"12345678901"` (CPF matematicamente inválido). Foi corrigido para `"52998224725"` para que a construção da entidade `Client` passe pela validação do `CpfValueObject`. |
| 5 | **Imports ausentes no arquivo de teste** | O arquivo de teste foi entregue sem os imports de `ClientValidator` e `ClientRepository`. Foram adicionados durante a fase de implementação. |

---

## 7. Estatísticas da Fase

| Categoria | Quantidade |
|---|---|
| Validators implementados | 1 (`ClientValidator`) |
| Métodos de validação | 2 (`existByCpf`, `existByCnpj`) |
| Exceções utilizadas | 1 (`ConflictException` / HTTP 409) |
| Contratos de repositório alterados | 1 (`ClientRepository`) |
| Testes criados | 4 casos |
| Testes passando | 4 / 4 ✅ |
| Arquivos criados/modificados | 4 |
