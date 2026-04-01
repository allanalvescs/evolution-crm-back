## 📋 Descrição da Funcionalidade

Implementação do fluxo de **cadastro de empresa** — Etapa 2 do onboarding do Evolution CRM. O usuário autenticado (ADMIN, criado na Etapa 1) registra a sua empresa, que fica vinculada ao seu perfil. A plataforma é multi-tenant: cada empresa possui dados completamente isolados.

**Rota:** `POST /companies`  
**Autenticação:** Obrigatória (JWT Bearer)  
**Regras de negócio:**
- Nome fantasia, Razão Social e CNPJ são obrigatórios
- CNPJ deve ser válido (formato e dígitos verificadores pelo algoritmo oficial)
- CNPJ deve ser único no sistema
- Somente o usuário autenticado registra sua própria empresa (userId extraído do token)
- O usuário não pode registrar mais de uma empresa (409 se já existir)

## 🛠️ Solução Implementada

A feature segue a arquitetura **Clean Architecture + DDD** já estabelecida no projeto, com separação em camadas: Domain → Application → Infrastructure → Presentation.

### Decisões arquiteturais

| Decisão | Justificativa |
|---|---|
| `CnpjValueObject` separado do `CpfCnpj` existente | O `CpfCnpj` é acoplado ao `EClientType` e ao contexto de cliente. CNPJ da empresa é um conceito distinto e independente |
| `CompanyRepository` como `abstract class` | Compatibilidade com o sistema de DI do NestJS, seguindo o padrão adotado em `UserRepository` |
| `userId` na tabela `companies` | Representa o dono/fundador. Suporta o fluxo de onboarding em duas etapas |
| `company_id` na tabela `users` (nullable) | Prepara a estrutura multi-tenant para features futuras sem quebrar usuários existentes |
| `CompanyValidator` no nível de Application | Validators que fazem I/O ficam em `src/applications/validator/`, seguindo o padrão de `UserValidator` e `AuthValidator` |
| `em.getReference()` no repositório para a FK `user` | Cria referência MikroORM ao `UserEntity` por PK sem carregar a entidade completa, evitando erros de validação ORM |

### Estrutura de arquivos criados

```
src/
├── domain/
│   ├── entities/company/company.ts               # Entidade Company (factory create)
│   ├── repositories/company.repository.ts        # Interface abstrata do repositório
│   └── value-objects/cnpj/cnpj.ts                # CnpjValueObject com validação completa
├── applications/
│   ├── usecases/company/register-company/        # RegisterCompanyUseCase + interface
│   └── validator/company/company.validator.ts    # CompanyValidator (existByCnpj, existByUserId)
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/company.entity.ts            # CompanyEntity ORM (MikroORM)
│   │   └── mappers/company/company.mapper.ts     # CompanyMapper (domain ↔ ORM)
│   ├── repositories/
│   │   ├── companies.repository.ts               # MikroOrmCompanyRepository
│   │   └── fakes/fake-company.repository.ts      # FakeCompanyRepository (testes)
│   └── migrations/Migration20260401122632.ts     # Cria tabela companies + company_id em users
└── modules/company/
    ├── company.controller.ts                     # POST /companies
    ├── company.module.ts                         # CompanyModule
    ├── service/company.service.ts                # CompanyService (orquestração)
    └── dtos/register-company/                    # RegisterCompanyCsDto + RegisterCompanyScDto
tests/
├── unit/domain/cnpj.test.ts                      # CnpjValueObject
├── unit/domain/company.test.ts                   # Entidade Company
├── unit/company.mapper.test.ts                   # CompanyMapper
├── unit/company.validator.spec.ts                # CompanyValidator (com FakeCompanyRepository)
├── unit/usecases/register-company.usecase.spec.ts
├── integration/company.controller.spec.ts
├── integration/company.service.spec.ts
└── e2e/company.e2e.test.ts                       # 8 cenários completos
```

### Fluxo de cadastro

```
POST /companies
  └── CompanyController.register()
        └── CompanyService.register()
              └── RegisterCompanyUseCase.execute()
                    ├── CompanyValidator.existByCnpj()     → 409 se CNPJ já existe
                    ├── CompanyValidator.existByUserId()   → 409 se usuário já tem empresa
                    ├── Company.create({ id: uuidv4(), ... })
                    └── CompanyRepository.create()
```

### Migration

- Cria tabela `companies` com constraint `UNIQUE` em `cnpj` e FK → `users.id`
- Adiciona coluna `company_id` (uuid, nullable) na tabela `users` com FK → `companies.id`

## 🔗 Links Relacionados

- [Planejamento de implementação](../tasks/company-implementation.md)

## ⚠️ Observações

- A migration `Migration20260401122632` deve ser aplicada no banco antes de subir o servidor (`npm run migration:up`)
- O `CpfCnpjValueObject` foi removido pois estava acoplado ao contexto de clientes e não era utilizado — substituído pelo `CnpjValueObject` dedicado
- Testes E2E requerem banco de dados real com a migration aplicada

## ✅ Checklist

- [x] Documentação técnica criada ou atualizada em `docs/issues/company-implementation.md`
- [x] Testes unitários implementados e passando (`npm test`)
- [x] Sem erros de lint nos arquivos da feature (`npm run lint`)
- [x] Code review solicitado
