---
applyTo: "src/domain/**/*.ts"
---

# Regras para a Camada de Domínio

O Domain é o núcleo da aplicação e deve permanecer **completamente puro**: sem dependência de frameworks, bibliotecas externas, ORM ou infraestrutura.

## Regra de dependência

A camada Domain **NUNCA** importa de:
- `src/shared/`
- `src/infrastructure/`
- `src/modules/`
- `src/applications/`
- Qualquer biblioteca de framework (NestJS, MikroORM, etc.)

## Entities

Entidades representam conceitos do domínio com identidade própria.

```typescript
export class RecursoDomain {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly createdAt: Date,
  ) {
    if (!name) throw new Error('Name is required');
  }
}
```

- Construtor realiza validações básicas de invariantes
- Sem decorators de framework (`@Entity`, `@Injectable`, etc.)
- Sem imports de ORM ou HTTP

## Value Objects

Value Objects representam conceitos sem identidade, definidos apenas pelo seu valor.

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

- Imutáveis: propriedades `readonly`, sem setters
- Validação no construtor — lança exceção se inválido
- Factory method estático (`create()`) como ponto de entrada

## Enums de domínio

Enums que representam conceitos do domínio devem ficar em `src/domain/enums/`:

```typescript
// src/domain/enums/user-role.enum.ts
export enum EUserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
}
```

**Nunca** criar enums de domínio em `src/shared/`.

## Interfaces de Repositório

Interfaces de repositório pertencem ao Domain e definem o contrato de persistência:

```typescript
// src/domain/repositories/recurso.repository.ts
export abstract class RecursoRepository {
  abstract create(recurso: RecursoDomain): Promise<void>;
  abstract findById(id: string): Promise<RecursoDomain | null>;
  abstract findByCompanyId(companyId: string): Promise<RecursoDomain[]>;
}
```

- Use `abstract class` (não `interface`) para compatibilidade com o DI do NestJS
- Métodos recebem e retornam entidades de **domínio** (nunca entidades ORM)

## Domain Services

Validators e regras de negócio que envolvem consulta a repositórios ficam em `src/domain/services/`:

```typescript
// src/domain/services/recurso.validator.ts
@Injectable()
export class RecursoValidator {
  constructor(private readonly recursoRepository: RecursoRepository) {}

  async existByName(name: string): Promise<void> {
    const exists = await this.recursoRepository.findByName(name);
    if (exists) throw new ConflictException('Recurso já existe');
  }
}
```
