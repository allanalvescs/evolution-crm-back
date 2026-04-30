---
applyTo: "src/domain/**/*.ts"
---

# Domain Rules

The Domain is the core of the application and must remain **completely pure**: without dependencies on frameworks, external libraries, ORM, or infrastructure.

## Dependencies Rules

he Domain layer **NEVER** imports from:
- `src/shared/`
- `src/infrastructure/`
- `src/modules/`
- `src/applications/`
- Any framework library (NestJS, MikroORM, etc.)

## Entities

Entities represent domain concepts with their own identity.

```typescript
type ResourceProps = {
  id: string;
  name: string;
};

export class ResourceDomain {
  private constructor(
    private readonly id: string,
    private name: string,
    private readonly createdAt: Date,
  ) {
    if (!name) throw new Error('Name is required');

    this.id = id;
    this.name = name

    this.createdAt = new Date();
  }

  static create(props: ResourceProps): ResourceDomain {
    return new ResourceDomain(props.id, props.name);
  }

  getId(): string { return this.id; }
  getName(): string { return this.name; }
}
```

- The constructor is **private** — no external layer instantiates the entity directly.
- The static method `create(props)` is the only entry point for creating the entity.
- All instance creation goes through `create()`, including in mappers, fakes, and tests.
- The constructor performs basic invariant validations.
- No framework decorators (`@Entity`, `@Injectable`, etc.).
- No ORM or HTTP imports.

## Value Objects

alue Objects represent concepts without identity, defined only by their value.

```typescript
export class EmailValueObject {
  private readonly value: string;

  private constructor(email: string) {
    if (!this.isValid(email)) throw new Error('Invalid email');
    this.value = email.toLowerCase();
  }

  static create(email: string): EmailValueObject {
    return new EmailValueObject(email);
  }

  getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

- Immutable: `readonly` properties, no setters
- Validation in the constructor — throws an exception if invalid
- Static factory method (`create()`) as the entry point

## Domain enums

Enums that represent domain concepts should be placed in `src/domain/enums/`:

```typescript
// src/domain/enums/user-role.enum.ts
export enum EUserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
}
```

**Never** create domain enums in `src/shared/`.

## Repository Interfaces

Repository interfaces belong to the Domain and define the persistence contract:

```typescript
// src/domain/repositories/Resource.repository.ts
export abstract class ResourceRepository {
  abstract create(Resource: ResourceDomain): Promise<void>;
  abstract findById(id: string): Promise<ResourceDomain | null>;
  abstract findByCompanyId(companyId: string): Promise<ResourceDomain[]>;
}
```

- Use `abstract class` (not `interface`) for compatibility with NestJS DI
- Methods receive and return **domain** entities (never ORM entities)

## Domain Services

Validators and business rules that involve querying repositories are located in `src/domain/services/`:

```typescript
// src/domain/services/Resource.validator.ts
@Injectable()
export class ResourceValidator {
  constructor(private readonly ResourceRepository: ResourceRepository) {}

  async existByName(name: string): Promise<void> {
    const exists = await this.ResourceRepository.findByName(name);
    if (exists) throw new ConflictException('Resource já existe');
  }
}
```
