# Backlog de Refatoração — Evolution CRM

> Pontos críticos identificados na análise do código atual cruzado com as diretrizes de
> `.copilot/copilot-instruction.md` e regras por camada.
>
> Para o processo e metodologia de execução, consulte `.copilot/copilot-intructions-refactor.md`.
>
> Legenda: `[ ]` pendente · `[x]` concluído · 🔴 Crítico · 🟡 Importante · 🟢 Melhoria

---

## Análise dos Fluxos Atuais

### Fluxo: Criação de Cliente

```
HTTP POST /clients
  └── ClientController.create()
        └── ClientService.create()                          ← Módulo (orquestração)
              ├── CnpjService.consult()                     ⚠️ chamada externa aqui, não no use case
              └── ClientCreateUseCase.execute()             ← Application
                    └── ClientValidator.existByCpfCnpj()   ⚠️ validator no lugar errado
                          └── ClientRepository.findByCpfCnpj()
                    ⛔ não cria nem persiste entidade — use case incompleto
```

### Fluxo: Signup

```
HTTP POST /auth/signup
  └── AuthController.signup()
        └── AuthService.signup()         ⚠️ lógica de use case dentro do service de módulo
              ├── UserValidator.existByEmail()
              ├── PasswordHasher.hash()
              ├── new User(...)           ← criação de entidade de domínio no módulo
              └── UserRepository.create()
```

### Fluxo: Signin

```
HTTP POST /auth/signin
  └── AuthController.signin()
        └── AuthService.signin()   ⛔ MÉTODO COMPLETAMENTE COMENTADO — rota quebrada
```

---

## Pontos Críticos por Camada

### Camada de Domínio

| ID | Problema | Localização |
|----|----------|-------------|
| D1 | Enums de domínio estão em `src/shared/enum/` — violação explícita da domain-instruction que proíbe enums de domínio em `src/shared/` | `src/shared/enum/` |
| D2 | Entidade `Client` importa de `src/shared/` — domínio com dependência de camada externa | `src/domain/entities/client.ts` |
| D3 | `Client` e `ClientAddress` são data classes com `assign()` sem construtor com invariantes — padrão diferente da entidade `User` | `src/domain/entities/` |
| D4 | Validators (`AuthValidator`, `ClientValidator`, `UserValidator`) estão em `src/applications/validator/` — deveriam estar em `src/domain/services/` | `src/applications/validator/` |
| D5 | Typo no nome da pasta: `value-objetcts` em vez de `value-objects` | `src/domain/value-objetcts/` |
| D6 | `UserValidator` lança `HttpException` com status code hardcoded (400) em vez de `ConflictException` (409) | `src/applications/validator/user/user.validator.ts` |
| D7 | `ClientValidator` lança `BadRequestException` (400) para duplicidade — semanticamente incorreto para conflito de dados | `src/applications/validator/client/client.validator.ts` |

### Camada de Aplicação

| ID | Problema | Localização |
|----|----------|-------------|
| A1 | `ClientCreateUseCase.execute()` incompleto: valida CPF/CNPJ mas não cria nem persiste a entidade, retorna `undefined` violando a regra "execute() deve sempre retornar um valor" | `src/applications/usecases/client/create/client-create.usecase.ts` |
| A2 | `AuthValidator.validate()` usa `bcryptjs.compare` diretamente — deveria usar o contract `PasswordHasher` em vez de dependência de infraestrutura | `src/applications/validator/auth/auth.validator.ts` |
| A3 | `AuthValidator.validate()` retorna o objeto `User` completo incluindo a senha — dado sensível exposto desnecessariamente | `src/applications/validator/auth/auth.validator.ts` |
| A4 | Não existem Use Cases para Signup e Signin — toda a lógica está no `AuthService` do módulo, violando a separação de camadas | `src/modules/auth/services/auth.service.ts` |

### Camada de Infraestrutura

| ID | Problema | Localização |
|----|----------|-------------|
| I1 | Repositórios duplicados: arquivos idênticos existem em dois caminhos distintos — `src/infrastructure/repositories/` e `src/infrastructure/persistence/repositories/` | ambas as pastas |
| I2 | `UserMapper` expõe `toDomain()` / `toPersistence()` mas os repositórios chamam `toOrmEntity()` / `toDomainEntity()` — métodos inexistentes causam erro em runtime | `src/infrastructure/persistence/repositories/users.repository.ts` |
| I3 | `ClientMapper` não mapeia o campo `idUser` — dado perdido silenciosamente na conversão domínio ↔ ORM | `src/infrastructure/persistence/mappers/client/client.mapper.ts` |
| I4 | Import do `ClientMapper` nos repositórios usa path sem subpasta (`mappers/client.mapper`) mas o arquivo está em `mappers/client/client.mapper` | `src/infrastructure/persistence/repositories/client.repository.ts` |
| I5 | `Client` domínio declara `id?: number` mas `BaseEntity` usa `id!: string (UUID)` — tipos incompatíveis entre camadas | `src/domain/entities/client.ts` vs `base-entity.ts` |
| I6 | `UserRepository` interface declara `findById(id: string)` mas implementações recebem `id: number` — contrato de domínio violado | `src/domain/repositories/user.repository.ts` vs implementações |
| I7 | Naming inconsistente nos mappers: `ClientMapper` usa `toDomainEntity/toOrmEntity`, `UserMapper` usa `toDomain/toPersistence` | ambos os mappers |
| I8 | `CnpjService` realiza integração com API externa mas está em `src/shared/services/` — deveria estar em `src/infrastructure/services/` | `src/shared/services/cnpj.service.ts` |

### Camada de Módulos (Apresentação)

| ID | Problema | Localização |
|----|----------|-------------|
| M1 | `AuthService.signup()` contém lógica de use case (criação de entidade, hash de senha, persistência) — o service de módulo deve apenas orquestrar | `src/modules/auth/services/auth.service.ts` |
| M2 | `AuthService.signin()` completamente comentado — a rota `/signin` falha em runtime | `src/modules/auth/services/auth.service.ts` |
| M3 | `ClientService.create()` chama `CnpjService.consult()` diretamente — validação de negócio/infra dentro da camada de orquestração | `src/modules/client/service/client.service.ts` |
| M4 | `UserService.me()` recebe `id: number` no payload, mas `User` e `UserRepository` operam com `id: string` (UUID) | `src/modules/user/service/user.service.ts` |
| M5 | Dois decorators com finalidades sobrepostas: `@ActiveUserId()` e `@ExtractPayload()` — gera inconsistência de uso entre controllers | `src/shared/decorators/` |
| M6 | `UserController` e `ClientController` sem `@ApiTags()` — inconsistência na documentação Swagger | `src/modules/user/`, `src/modules/client/` |
| M7 | `ClientCreateFactory` existe mas não é utilizado em nenhum lugar do código | `src/modules/client/factory/client-create.factory.ts` |

### Testes

| ID | Problema | Localização |
|----|----------|-------------|
| T1 | Arquivos `.test.ts` dentro de `src/` — violação da testing-instruction: "Nunca criar arquivos de teste dentro de `src/`" | `src/domain/**/*.test.ts`, `src/infrastructure/**/*.test.ts` |
| T2 | Arquivos `.spec.ts` dentro de `src/modules/` — mesma violação | `src/modules/auth/auth.controller.spec.ts`, `src/modules/user/user.service.spec.ts` |
| T3 | Nenhum teste segue o padrão de nomenclatura obrigatório: `should_<comportamento>_when_<condição>` | todos os arquivos de teste |

---

## Backlog de Tarefas

### Grupo 1 — Estrutura e Organização de Pastas

- [x] **[R-E1]** 🔴 Criar `src/domain/enums/` e mover os três enums de domínio para ela
  - `EUserRole` → `src/domain/enums/user-role.enum.ts`
  - `EClientType` → `src/domain/enums/client-type.enum.ts`
  - `EStatus` → `src/domain/enums/status.enum.ts`
  - Atualizar todos os imports após a movimentação

- [x] **[R-E2]** 🔴 Renomear pasta `src/domain/value-objetcts/` para `src/domain/value-objects/`
  - Atualizar todos os imports que referenciam o caminho antigo

- [x] **[R-E3]** 🔴 Remover repositórios duplicados de `src/infrastructure/repositories/`
  - Implementação canônica fica apenas em `src/infrastructure/persistence/repositories/`
  - Atualizar módulos que injetam as implementações removidas

- [ ] **[R-E4]** 🟡 Criar `src/domain/services/` e mover os validators para ela
  - `AuthValidator`, `ClientValidator`, `UserValidator` saem de `src/applications/validator/`
  - Atualizar imports nos use cases

- [ ] **[R-E5]** 🟡 Mover `CnpjService` de `src/shared/services/` para `src/infrastructure/services/`

- [ ] **[R-E6]** 🟢 Mover arquivos de teste de `src/` para `tests/`
  - `src/domain/**/*.test.ts` → `tests/unit/domain/`
  - `src/infrastructure/**/*.test.ts` → `tests/unit/` ou `tests/integration/`
  - `src/modules/**/*.spec.ts` → `tests/integration/`

---

### Grupo 2 — Camada de Domínio

- [x] **[R-D1]** 🔴 Remover import de `src/shared/` da entidade `Client` (depende de R-E1)

- [x] **[R-D2]** 🔴 Alinhar tipo de `id` entre entidade de domínio `Client` (`number`) e `BaseEntity` ORM (`string` UUID)
  - Definir um único tipo e aplicar consistentemente em todas as camadas

- [ ] **[R-D3]** 🟡 Refatorar entidade `Client` para o padrão com construtor e invariantes
  - Remover o método `assign()`, substituir por construtor com validação — padrão já adotado pela entidade `User`

- [ ] **[R-D4]** 🟡 Refatorar entidade `ClientAddress` com o mesmo padrão de R-D3

- [ ] **[R-D5]** 🟡 Corrigir `ClientValidator`: `BadRequestException` (400) → `ConflictException` (409)

- [ ] **[R-D6]** 🟡 Corrigir `UserValidator`: `HttpException` hardcoded → `ConflictException` semântico

---

### Grupo 3 — Camada de Infraestrutura

- [x] **[R-I1]** 🔴 Alinhar nomes dos métodos de `UserMapper` com os que os repositórios chamam
  - Escolher convenção única (`toDomain/toPersistence` ou `toDomainEntity/toOrmEntity`) e aplicar em todos os mappers

- [x] **[R-I2]** 🔴 Corrigir assinatura de `UserRepository.findById()`: interface usa `string`, implementações usam `number`
  - Alinhar para `string` (UUID), consistente com `User.getId(): string`

- [ ] **[R-I3]** 🟡 Corrigir `ClientMapper` para incluir o mapeamento do campo `idUser`

- [ ] **[R-I4]** 🟡 Corrigir path do import de `ClientMapper` nos repositórios

- [ ] **[R-I5]** 🟢 Padronizar naming dos métodos de mapper: aplicar a mesma convenção de R-I1 em todos os arquivos

---

### Grupo 4 — Camada de Aplicação

- [x] **[R-A1]** 🔴 Completar `ClientCreateUseCase.execute()`: criar entidade, persistir e retornar resultado

- [x] **[R-A2]** 🔴 Criar `SignupUseCase` em `src/applications/usecases/auth/`
  - Mover lógica atualmente em `AuthService.signup()` para o use case

- [x] **[R-A3]** 🔴 Criar `SigninUseCase` em `src/applications/usecases/auth/`
  - Implementar autenticação usando contracts `PasswordHasher` e `TokenGenerator` — remover uso direto de `bcryptjs`

- [ ] **[R-A4]** 🟡 Corrigir `AuthValidator.validate()` para não retornar o objeto `User` com senha

- [ ] **[R-A5]** 🟡 Substituir uso direto de `bcryptjs` em `AuthValidator` pelo contract `PasswordHasher`

---

### Grupo 5 — Camada de Módulos (Apresentação)

- [x] **[R-M1]** 🔴 Restaurar `AuthService.signin()` usando o `SigninUseCase` de R-A3

- [ ] **[R-M2]** 🟡 Refatorar `AuthService.signup()` para apenas orquestrar o `SignupUseCase` de R-A2

- [ ] **[R-M3]** 🟡 Remover `CnpjService.consult()` do `ClientService` — mover para o use case ou domain service

- [ ] **[R-M4]** 🟡 Corrigir tipo do `id` em `UserService.me()`: `number` → `string`

- [ ] **[R-M5]** 🟢 Consolidar `@ActiveUserId()` e `@ExtractPayload()` em um único decorator ou definir uso exclusivo de cada um

- [ ] **[R-M6]** 🟢 Adicionar `@ApiTags()` em `UserController` e `ClientController`

- [ ] **[R-M7]** 🟢 Remover `ClientCreateFactory` se não houver uso previsto

---

### Grupo 6 — Testes

- [x] **[R-T1]** 🔴 Mover todos os arquivos de teste de dentro de `src/` para `tests/`

- [ ] **[R-T2]** 🟡 Renomear todos os casos de teste para o padrão `should_<comportamento>_when_<condição>`

- [ ] **[R-T3]** 🟢 Criar fakes de repositório reutilizáveis em `tests/fakes/`
  - `FakeUserRepository`, `FakeClientRepository`

---

## Resumo por Prioridade

| Prioridade | Qtd | IDs |
|------------|-----|-----|
| 🔴 Crítico | 10 | R-E1, R-E2, R-E3, R-D1, R-D2, R-A1, R-A2, R-A3, R-I1, R-I2, R-M1, R-T1 |
| 🟡 Importante | 12 | R-E4, R-D3, R-D4, R-D5, R-D6, R-A4, R-A5, R-I3, R-I4, R-M2, R-M3, R-M4, R-T2 |
| 🟢 Melhoria | 6 | R-E5, R-E6, R-I5, R-M5, R-M6, R-M7, R-T3 |
| **Total** | **28** | |
