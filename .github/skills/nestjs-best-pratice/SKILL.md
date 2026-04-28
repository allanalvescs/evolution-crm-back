---
name: nestjs-best-practices
description: >
  NestJS implementation best practices: controllers, services modules,
  guards, interceptors, pipes, decorators, dependency injection, and ORM integration.
reference: https://docs.nestjs.com/
---

# 🧠 SKILL: nestjs-best-practices

## 📖 Description
The nestjs-best-practices skill enables the AI agent to operate as a senior backend engineer specialized in NestJS, applying modern architectural patterns focused on scalability, maintainability, and clean code.

This skill guides code generation, refactoring, and technical decision-making based on established principles such as SOLID, Clean Architecture, and Domain-Driven Design (DDD).

## 🎯 Objective

**Ensure that every suggestion, implementation, or refactoring:**

- Follows official NestJS best practices
- Is oriented toward low coupling and high cohesion
- Promotes clear separation of responsibilities
- Is easily testable and scalable
- Avoids common “code smells” in Node.js applications

## Reasoning Before Generating

Before writing any code, evaluate:

- **Scope**: Is it a standalone module, a complete feature, or a project architecture?
- **Layer**: Controller, Service, Repository, Guard, Pipe, Interceptor, or Decorator?
- **ORM / Database**: Prisma, TypeORM, MikroORM,Mongoose, or raw query?
- **Transport**: REST, GraphQL, gRPC, or Message Broker (Kafka/RabbitMQ)?
- **Authentication**: JWT, OAuth2, API Key, Session?

Only then generate the code — in the correct layer, without mixing responsibilities.


## Module Structure

Each domain must be a self-contained module with `imports`, `providers`,
`controllers`, and `exports` explicitly declared.

Each module has a well-defined responsibility and must not leak concerns across layers.

The system is divided into:

- Interface Layer → modules/
- Application Layer → application/
- Infrastructure Layer → infrastructure/
- Shared Cross-Cutting → shared/

```
src/
├── app.module.ts
├── test/
├── shared/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   └── configuration.ts
├── migrations/
├── application/
│   └── usecase/
    │   ├── user
    │   ├── company
    │   ├── usecase.module.ts
    └── validator/
    │   ├── user
    │   ├── company
    │   └── validator.module.ts
└── modules/
    └── users/
      ├── users.module.ts
      ├── users.controller.ts
      ├── users.service.ts
      ├── users.repository.ts   ← abstração opcional do ORM
      ├── dto/
      │   ├── create-user.dto.ts
      │   └── update-user.dto.ts
└── infraestructure/
    └── persistence
    │   └── entities/
    │   │   └── user.entity.ts
    └── database.module.ts
```
-----
### 1. 🧩 Interface Modules (modules/)

**Responsibility:** Feature modules (e.g., users/) are the entry point of the application. They are responsible for:

- Handling HTTP requests (controllers)
- Mapping input/output (DTOs)
- Delegating execution to use cases
- Applying guards, pipes, and interceptors

#### 📁 Example
```
modules/users/
├── dto/
├── users.module.ts
├── users.controller.ts
├── service/
    └──user.service.ts
```
#### ⚠️ Rules

- Controllers must be thin
- Services must act as orchestrators, not business logic owners
- Never implement complex business rules here
- Always delegate to application/usecase

#### 🆕 Creating a New Resource Module

When introducing a new resource (e.g., company, clients ...). You MUST:

1. Create a dedicated module under modules/
2. Define:
   - Controller
   - DTOs
   - Service (orchestrator)
3. Connect it to corresponding use cases

### 2. 🧠 Application Modules (application/)
> `usecase.module.ts`

**Responsibility:** Centralizes business use cases orchestration. Each use case represents a single business action:

- CreateUserUseCase
- UpdateCompanyUseCase

#### 📁 Structure
```
application/usecase/
├── user/
├── company/
├── usecase.module.ts
```

#### ⚠️ Rules
- Must contain pure business logic
- Must be framework-agnostic
- Must NOT depend on controllers or NestJS decorators
- Can depend on interfaces (contracts) for persistence

#### 🧠 Behavior
- Coordinates domain rules
- Handles transactions (when needed)
- Calls repositories via abstraction


> `validator.module.ts`

**Responsibility** Centralizes business validation logic, separate from transport-level validation.

#### 📁 Structure

```
application/validator/
├── user/
├── company/
├── validator.module.ts
```

#### ⚠️ Rules
- Used for business rule validation, not DTO validation
- Should not depend on HTTP layer
- Can be reused across multiple use cases


Examples:
```typescript
@Injectable()
export class UserValidator {
  constructor(private readonly userRepository: UserRepository) {}

  async existByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new HttpException(
        "Já existe um usuário com esse email",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

```

### 3. 🏗️ Infrastructure Modules (infrastructure/)
> `database.module.ts`

**Responsibility:** Encapsulates all database configuration and ORM integration (e.g., MikroORM).

#### 📁 Structure

```
infrastructure/
└── persistence/
    ├── entities/
    │   └── user.entity.ts
└── database.module.ts
```

#### ⚠️ Rules
- Must isolate ORM-specific logic
- Must not leak ORM details to application layer
- Should expose repositories via interfaces or providers

#### Behavior
- Configure ORM (connections, entities, migrations)
- Register repositories/providers
- Handle transactions (if centralized)

---

### 🔄 Module Interaction Flow

```
Controller → Service → UseCase → Repository → Database
```

## 📦 Good Code Practices
- Use DTOs with validation (`class-validator`, `class-transformer`)
- Standardize API responses (interceptors or adapters)
- Handle exceptions with `Exception Filters`
- Use `Pipes` for data validation and transformation
- Avoid excessive use of inline logic or duplicate code
- Follow consistent naming conventions

## ⚙️ Scalability & Maintainability
- Encourage modular and decoupled architecture
- Promote use of:
  - Custom providers
  - Factories
  - Interfaces and abstractions
- Prepare the system for:
  - Microservices (when appropriate)
  - Asynchronous processing (queues, events)

## 🚫 Anti-patterns
**Avoid:**
- Business logic inside controllers or services
- Direct ORM usage inside use cases
- Validation logic inside DTOs that belongs to business rules
- Skipping use case layer for “simple operations”
- Shared modules becoming “dumping ground”

