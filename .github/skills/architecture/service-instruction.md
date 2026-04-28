---
applyTo: "src/module/**/service/*.service.ts"
---

# Services Rules

The Service layer is responsible for orchestrating the application flow, acting as an intermediary between the input layer (**Controller**) and the business rules (**UseCases**).

It defines how different parts of the system interact, without implementing the business logic itself.

## Responsabilities

**1. UseCase Orchestration:**

    * Coordinate the execution of one or more UseCases
    * Define the order in which operations are executed.

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(data: CreateUserDTO) {
    await this.createUserUseCase.execute(data);
    await this.sendWelcomeEmailUseCase.execute(user);
  }
} 
```
---
**2. Flow Coordination (Application Logic)**

    * Control execution flows (sequence, fallback, offsets)
    * Apply process rules (not domain rules)

Example:
> *Após criar usuário* → *enviar email* → *registrar log*
---
**3. Integration with external services**

    * External APIs (payment, authentication, etc.)
    * Messaging systems (Kafka, SQS, RabbitMQ)

**4. Transaction Management**

    * Initiate and complete transactions
    * Ensure consistency across multiple operations
    * Use transactions methods comming from MikroORM

**5. Anti-Corruption Layer**

    * Adapting data between external systems and the internal domain.
    * Prevent external formats from contaminating the domain.
    * Typically located in the infrastructure layer, but used via Service or UseCase.

      * Service / UseCase → Interface (domínio) → ACL (infra) → Sistema externo (Stripe, AWS, etc)

**6. Application Error Handling**

    * Mapping technical errors into understandable errors
    * Controlling integration failures
---
## Structure of a Service

```Typescript
@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly emailService: EmailService,
    private readonly logger: Logger,
  ) {}

  async createUser(data: CreateUserDto) {
    const user = await this.createUserUseCase.execute(data);

    await this.emailService.send(user.email);

    this.logger.log(`User created: ${user.id}`);

    return user;
  }
}

```

### Expected Features
* Action-oriented methods (verbs)
* Low internal complexity
* Explicit dependencies via injection
* No coupling with ORM
---

## Restrictions

1. *Failure to implement business rules, Every rule should be in the UseCases.*
2. *Do not access the database directly. Never use MikroORM directly in Service.*
3. *Do not contain complex logic. If the method has:*
     * Many if/else statements
     * Complex decisions
     * Domain validations

    👉 This should go in the `UseCase`
4. *Not depending on infrastructure details*
    * ORM
    * frameworks externos
    * libs específicas
5. *Not being "God Service". Avoid classes with too many responsibilities:*

```Typescript
// WRONG
UserService:
 - createUser
 - deleteUser
 - processPayment
 - sendEmail
 - generateReport
```

### ⚠️ Common anti-patterns
🔴 **God-Class Service (High-Quality Service)**

  * Focuses on business rules + infrastructure + orchestration

🔴 **Service as Repository**

  * Accesses database directly

🔴 **Service duplicating UseCase**

  * Same logic spread across multiple locations

## ✅ Best Practices
* Maintain thin-layer services.
* Delegate logic to UseCases.
* Use explicit names: 
    * createUser,
    * processPayment.
* Orchestrate, don't decide rules. 
* Facilitate testing (mock dependencies).

## 🚀 Summary

| Aspect          | Service Layer |
| ---------------- | ------------- |
| Function            | Orquestração  |
| Business Rule       | ❌ No         |
| Data access         | ❌ No         |
| Integrations        | ✅ Yes         |
| Complexity          | Baixa         |
