---
applyTo: "src/applications/usecases/**/*.ts"
---

# Regras para Use Cases

Use Cases pertencem à camada de **Application** e são responsáveis por orquestrar o fluxo de uma funcionalidade, coordenando entidades de domínio e repositórios para cumprir um caso de uso específico.

## Responsabilidade

O Use Case **não deve depender de frameworks, ORM ou HTTP**. Ele:

1. Recebe uma interface de entrada tipada
2. Executa validações de regra de negócio (via Domain Services ou diretamente)
3. Cria ou manipula entidades de domínio
4. Persiste via interfaces de repositório
5. Retorna o resultado tipado

## Estrutura esperada

```typescript
@Injectable()
export class RecursoCreateUseCase {
  constructor(
    private readonly recursoRepository: RecursoRepository,  // interface do domain
    private readonly recursoValidator: RecursoValidator,     // domain service
  ) {}

  async execute({ data, userId }: RecursoCreateUseCaseInterface): Promise<RecursoDomain> {
    await this.recursoValidator.existByIdentifier(data.identifier);

    const entity = new RecursoDomain(
      uuidv4(),
      data.name,
      userId,
    );

    await this.recursoRepository.create(entity);

    return entity;
  }
}
```

## Contrato de interface

Cada Use Case deve ter uma interface de entrada em arquivo separado:

```typescript
// recurso-create-interface.usecase.ts
export interface RecursoCreateUseCaseInterface {
  data: {
    name: string;
    // ...
  };
  userId: string;
}
```

## Regras

- Todo Use Case deve ser uma classe `@Injectable()` com método `execute()`
- Dependa apenas de **interfaces** definidas em `src/domain/` (repositórios, contracts)
- **Nunca** importe diretamente entidades ORM (`@Entity` do MikroORM)
- **Nunca** importe de `src/modules/` ou `src/infrastructure/`
- O método `execute()` deve sempre retornar um valor (nunca `void`)
- Um Use Case = uma responsabilidade (um único fluxo de negócio)

## Evite

- Múltiplas responsabilidades em um único `execute()`
- Lógica de formatação de resposta (isso é papel do controller/service de orquestração)
- Dependências de infraestrutura concretas (bcrypt, jwt, ORM) diretamente — use contracts/interfaces
