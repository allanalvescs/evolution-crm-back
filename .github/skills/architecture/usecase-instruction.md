---
applyTo: "src/applications/usecases/**/*.ts"
---

# Rules for Use Cases

Use Cases belong to the **Application** layer and are responsible for orchestrating the flow of a functionality, coordinating domain entities and repositories to fulfill a specific use case.

## Responsabilities

The Use Case **should not depend on frameworks, ORM, or HTTP**. It:

1. Receives a typed input interface
2. Performs business rule validations (via Domain Services or directly)
3. Creates or manipulates domain entities
4. Persists via repository interfaces
5. Returns the typed result

## Estrutura esperada

```typescript
@Injectable()
export class ResourceCreateUseCase {
  constructor(
    private readonly resourceRepository: ResourceRepository,  // interface do domain
    private readonly resourceValidator: ResourceValidator,     // domain service
  ) {}

  async execute({ data, userId }: resourceCreateUseCaseInterface): Promise<ResourceDomain> {
    await this.resourceValidator.existByIdentifier(data.identifier);

    const entity = ResourceDomain.create({
      id: uuid4(),
      name: data.name,
      userId
    });

    await this.resourceRepository.create(entity);

    return entity;
  }
}
```

## Interface Agreement

Each Use Case should have a separate input interface file:

```typescript
// resource-create-interface.usecase.ts
export interface ResourceCreateUseCaseInterface {
  data: {
    name: string;
    // ...
  };
  userId: string;
}
```

## Rules

- Every Use Case must be a `@Injectable()` class with an `execute()` method.
- Depend only on **interfaces** defined in `src/domain/` (repositories, contracts).
- **Never** import ORM entities directly (`@Entity` from MikroORM).
- **Never** import from `src/modules/` or `src/infrastructure/`.
- The `execute()` method must always return a value (never `void`).
- One Use Case = one responsibility (a single business flow)

## Avoid

- Multiple responsibilities in a single `execute()` statement
- Response formatting logic (this is the role of the orchestration controller/service)
- Direct concrete infrastructure dependencies (bcrypt, jwt, ORM) — use contracts/interface
