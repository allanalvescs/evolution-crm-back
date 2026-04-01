# Feature: Cadastro de Empresa (`feature/company`)

## Visão Geral

Implementação do fluxo de cadastro de empresa (Etapa 2 do onboarding). O usuário autenticado (ADMIN, criado na Etapa 1) registra a sua empresa, que fica vinculada ao seu perfil. A feature segue a arquitetura Clean Architecture + DDD já estabelecida no projeto.

**Rota:** `POST /companies`  
**Autenticação:** Obrigatória (JWT)  
**Regras de negócio:**
- Nome fantasia, Razão Social e CNPJ são obrigatórios
- CNPJ deve ser válido (formato e dígitos verificadores)
- CNPJ deve ser único no sistema
- Somente o usuário autenticado pode registrar sua própria empresa
- O usuário não pode registrar mais de uma empresa

---

## Campos da entidade `Company`

| Campo          | Tipo     | Obrigatório | Observação                        |
|----------------|----------|-------------|-----------------------------------|
| `id`           | UUID     | Sim         | Gerado automaticamente            |
| `tradeName`    | string   | Sim         | Nome fantasia                     |
| `companyName`  | string   | Sim         | Razão Social                      |
| `cnpj`         | string   | Sim         | Válido e único no sistema         |
| `phone`        | string   | Não         | Telefone de contato               |
| `userId`       | UUID     | Sim         | FK → users (dono da empresa)      |
| `dtCreatedAt`  | Date     | Sim         | Gerado automaticamente            |
| `dtUpdatedAt`  | Date     | Sim         | Atualizado automaticamente        |

---

## Relacionamento com `User`

- A tabela `companies` armazena o `userId` (FK → `users.id`) representando o dono/ADMIN da empresa
- A tabela `users` recebe uma coluna `companyId` (FK → `companies.id`, nullable) para isolamento multi-tenant nas features futuras
- Na migração, `users.company_id` é adicionado como nullable (usuários já cadastrados ainda não têm empresa)

---

## To-Do List de Implementação

### Etapa 1 — Domínio

- [ ] **1.1** Criar Value Object `CnpjValueObject` em `src/domain/value-objects/cnpj/cnpj.ts`
  - Construtor privado com factory `static create(value: string)`
  - Validar formato (14 dígitos numéricos)
  - Validar dígitos verificadores do CNPJ (algoritmo oficial)
  - Lança `Error` se inválido
  - Getter `getValue(): string`

- [ ] **1.2** Criar entidade de domínio `Company` em `src/domain/entities/company/company.ts`
  - Construtor privado + factory `static create(props: CompanyProps)`
  - Campos: `id`, `tradeName`, `companyName`, `cnpj` (CnpjValueObject), `phone` (PhoneValueObject | null), `userId`, `dtCreatedAt`, `dtUpdatedAt`
  - Validações de invariantes: `id`, `tradeName`, `companyName`, `cnpj` e `userId` são obrigatórios
  - Getters públicos para todos os campos
  - Sem imports de framework, ORM ou infraestrutura

- [ ] **1.3** Criar interface de repositório `CompanyRepository` em `src/domain/repositories/company.repository.ts`
  - `abstract class` (compatibilidade com DI do NestJS)
  - Métodos:
    - `create(company: Company): Promise<void>`
    - `findByCnpj(cnpj: string): Promise<Company | null>`
    - `findByUserId(userId: string): Promise<Company | null>`

---

### Etapa 2 — Testes Unitários do Domínio

- [ ] **2.1** Criar testes unitários para `CnpjValueObject` em `tests/unit/domain/cnpj.test.ts`
  - Deve criar instância com CNPJ válido
  - Deve lançar erro para CNPJ com formato inválido (menos de 14 dígitos)
  - Deve lançar erro para CNPJ com dígitos verificadores incorretos
  - Deve lançar erro para CNPJ vazio

- [ ] **2.2** Criar testes unitários para a entidade `Company` em `tests/unit/domain/company.test.ts`
  - Deve criar instância com props válidos
  - Deve lançar erro se `id` for vazio
  - Deve lançar erro se `tradeName` for vazio
  - Deve lançar erro se `companyName` for vazio
  - Deve lançar erro se `cnpj` for inválido (via CnpjValueObject)
  - Deve lançar erro se `userId` for vazio
  - Deve aceitar `phone` como null

---

### Etapa 3 — Validadores de Aplicação

- [ ] **3.1** Criar `CompanyValidator` em `src/applications/validator/company/company.validator.ts`
  - Método `existByCnpj(cnpj: string): Promise<void>` — lança `ConflictException` (409) se CNPJ já cadastrado
  - Método `existByUserId(userId: string): Promise<void>` — lança `ConflictException` (409) se usuário já possui empresa cadastrada
  - Injetar `CompanyRepository` via DI

- [ ] **3.2** Criar testes unitários para `CompanyValidator` em `tests/unit/company.validator.spec.ts`
  - `existByCnpj`: deve passar quando CNPJ não existe
  - `existByCnpj`: deve lançar ConflictException quando CNPJ já cadastrado
  - `existByUserId`: deve passar quando usuário não possui empresa
  - `existByUserId`: deve lançar ConflictException quando usuário já tem empresa

---

### Etapa 4 — Use Case

- [ ] **4.1** Criar interface de entrada `RegisterCompanyUseCaseInterface` em `src/applications/usecases/company/register-company/register-company-interface.usecase.ts`
  - Campos: `tradeName`, `companyName`, `cnpj`, `phone?`, `userId`

- [ ] **4.2** Criar `RegisterCompanyUseCase` em `src/applications/usecases/company/register-company/register-company.usecase.ts`
  - Injetar: `CompanyRepository`, `CompanyValidator`
  - Fluxo:
    1. Validar CNPJ único via `companyValidator.existByCnpj()`
    2. Validar usuário sem empresa via `companyValidator.existByUserId()`
    3. Criar entidade `Company.create({ id: uuidv4(), ...data })`
    4. Persistir via `companyRepository.create(company)`
    5. Retornar a entidade criada

- [ ] **4.3** Criar testes unitários para `RegisterCompanyUseCase` em `tests/unit/usecases/register-company.usecase.spec.ts`
  - Deve registrar empresa com dados válidos e retornar entidade
  - Deve lançar erro quando CNPJ já cadastrado
  - Deve lançar erro quando usuário já tem empresa
  - Verificar que `companyRepository.create` foi chamado com a entidade correta
  - Usar mocks para `CompanyRepository` e `CompanyValidator`

---

### Etapa 5 — Fake Repository

- [ ] **5.1** Criar `FakeCompanyRepository` em `src/infrastructure/repositories/fakes/fake-company.repository.ts`
  - Implementa `CompanyRepository`
  - Armazena dados em memória (`private companies: Company[] = []`)
  - Implementar: `create`, `findByCnpj`, `findByUserId`
  - Usado em testes de integração entre camadas (usecase → validator)

---

### Etapa 6 — Infraestrutura

- [ ] **6.1** Criar entidade ORM `CompanyEntity` em `src/infrastructure/persistence/entities/company.entity.ts`
  - Estender `BaseEntity` (uuid PK, dtCreatedAt, dtUpdatedAt)
  - Campos: `tradeName`, `companyName`, `cnpj` (unique), `phone` (nullable)
  - Relacionamento: `ManyToOne` → `UserEntity` (campo `userId`)
  - Decorator `@Entity({ tableName: 'companies' })`

- [ ] **6.2** Criar migration em `src/migrations/Migration<timestamp>_create_companies.ts`
  - Criar tabela `companies` com todos os campos
  - Adicionar constraint `UNIQUE` em `cnpj`
  - Adicionar coluna `company_id` (uuid, nullable) na tabela `users` com FK → `companies.id`
  - Implementar `down()` para reverter as alterações

- [ ] **6.3** Criar mapper `CompanyMapper` em `src/infrastructure/persistence/mappers/company/company.mapper.ts`
  - `static toDomainEntity(entity: CompanyEntity): Company`
  - `static toOrmEntity(company: Company): CompanyEntity`

- [ ] **6.4** Criar `MikroOrmCompanyRepository` em `src/infrastructure/repositories/companies.repository.ts`
  - Implementa `CompanyRepository`
  - Injetar `EntityRepository<CompanyEntity>` e `EntityManager`
  - Implementar: `create`, `findByCnpj`, `findByUserId`

- [ ] **6.5** Criar testes unitários para `CompanyMapper` em `tests/unit/company.mapper.test.ts`
  - `toDomainEntity`: deve mapear corretamente de ORM para domínio
  - `toOrmEntity`: deve mapear corretamente de domínio para ORM

---

### Etapa 7 — Módulo de Apresentação

- [ ] **7.1** Criar DTO de entrada `RegisterCompanyCsDto` em `src/modules/company/dtos/register-company/register-company-cs.dto.ts`
  - Campos com decorators `class-validator`: `tradeName`, `companyName`, `cnpj`, `phone?`
  - Validações: `@IsString()`, `@IsNotEmpty()`, `@IsOptional()`, `@Matches()` para CNPJ

- [ ] **7.2** Criar DTO de saída `RegisterCompanyScDto` em `src/modules/company/dtos/register-company/register-company-sc.dto.ts`
  - Campos: `id`, `tradeName`, `companyName`, `cnpj`, `phone`, `userId`, `dtCreatedAt`

- [ ] **7.3** Criar `CompanyService` em `src/modules/company/service/company.service.ts`
  - Método `register(dto, userId): Promise<RegisterCompanyScDto>`
  - Orquestra chamada ao `RegisterCompanyUseCase`
  - Mapeia entidade de domínio para DTO de resposta
  - Sem lógica de negócio

- [ ] **7.4** Criar `CompanyController` em `src/modules/company/company.controller.ts`
  - `@Controller('v1/companies')`
  - Método `POST /` com `@Post()`
  - Recebe `@Body() dto: RegisterCompanyCsDto` e `@ExtractPayload()` para pegar `userId` do token JWT
  - Retorna status `201 Created`
  - Decorators Swagger: `@ApiOperation`, `@ApiCreatedResponse`, `@ApiBearerAuth`

- [ ] **7.5** Criar `CompanyModule` em `src/modules/company/company.module.ts`
  - Registrar: `CompanyController`, `CompanyService`
  - Importar `UsecaseModule` (registrar `RegisterCompanyUseCase` lá)
  - Fornecer bindings de DI: `CompanyRepository → MikroOrmCompanyRepository`
  - Registrar `CompanyEntity` no `MikroOrmModule.forFeature()`

- [ ] **7.6** Atualizar `UsecaseModule` para registrar e exportar `RegisterCompanyUseCase`

- [ ] **7.7** Atualizar `ValidatorModule` para registrar e exportar `CompanyValidator`

- [ ] **7.8** Registrar `CompanyModule` em `AppModule`

---

### Etapa 8 — Testes de Integração

- [ ] **8.1** Criar testes de integração para `CompanyService` em `tests/integration/company.service.spec.ts`
  - Usar `Test.createTestingModule` com mock do `RegisterCompanyUseCase`
  - Deve chamar o use case e retornar DTO de resposta corretamente
  - Deve propagar erros do use case

- [ ] **8.2** Criar testes de integração para `CompanyController` em `tests/integration/company.controller.spec.ts`
  - Usar `Test.createTestingModule` com mock do `CompanyService`
  - Deve retornar 201 com corpo correto em requisição válida
  - Deve retornar 400/409 para erros de validação/conflito

---

### Etapa 9 — Teste E2E

- [ ] **9.1** Criar teste E2E em `tests/e2e/company.e2e.test.ts`
  - Setup com `AppModule` real + banco de dados de teste
  - Cenários:
    - `POST /v1/companies` com dados válidos → 201 + corpo correto + persistência verificada no banco
    - `POST /v1/companies` com CNPJ já cadastrado → 409 Conflict
    - `POST /v1/companies` com usuário já tendo empresa → 409 Conflict
    - `POST /v1/companies` sem autenticação → 401 Unauthorized
    - `POST /v1/companies` com CNPJ inválido → 400 Bad Request
    - `POST /v1/companies` com campos obrigatórios ausentes → 400 Bad Request
  - Limpeza de dados no `afterEach` via `EntityManager`

---

### Etapa 10 — Validação Final

- [ ] **10.1** Garantir que todos os testes passam com `npm run test`
- [ ] **10.2** Garantir que o build compila sem erros com `npm run build`

---

## Ordem de execução recomendada

```
1.1 → 1.2 → 1.3 → 2.1 → 2.2 → 3.1 → 3.2 → 4.1 → 4.2 → 4.3 → 5.1
→ 6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 7.1 → 7.2 → 7.3 → 7.4 → 7.5
→ 7.6 → 7.7 → 7.8 → 8.1 → 8.2 → 9.1 → 10.1 → 10.2
```

---

## Decisões Arquiteturais

| Decisão | Justificativa |
|---|---|
| `CnpjValueObject` separado do `CpfCnpj` existente | O `CpfCnpj` é acoplado ao `EClientType` e ao contexto de cliente. CNPJ da empresa é um conceito distinto e independente |
| `CompanyRepository` como `abstract class` | Compatibilidade com o sistema de DI do NestJS, seguindo o padrão já adotado em `UserRepository` |
| `userId` na tabela `companies` | Representa o dono/fundador da empresa. Suporta o fluxo de onboarding em duas etapas |
| `company_id` na tabela `users` (nullable) | Prepara a estrutura multi-tenant para features futuras sem quebrar usuários já existentes |
| Validator no nível de Application (não Domain) | Validators que fazem I/O (consulta ao repositório) ficam em `src/applications/validator/`, seguindo o padrão do `UserValidator` e `AuthValidator` já presentes no projeto |
