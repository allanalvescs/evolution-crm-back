---
applyTo: "tests/**/*.ts"
---

# Regras para Testes

O desenvolvimento segue **Test Driven Development (TDD)**. Testes são escritos **antes** da implementação.

## Fluxo TDD

1. Escreva um teste que falha (Red)
2. Implemente o mínimo de código necessário para o teste passar (Green)
3. Refatore mantendo todos os testes passando (Refactor)

## Estrutura de pastas

```
tests/
├── unit/          (entities, value objects, use cases, domain services)
└── integration/   (controllers, repositórios com banco real)
```

**Nunca** criar arquivos `.spec.ts` ou `.test.ts` dentro de `src/`.

## Nomenclatura obrigatória

```
should_<comportamento_esperado>_when_<condicao>
```

Exemplos:

```typescript
it('should_create_client_when_valid_data_is_provided', () => { ... });
it('should_throw_error_when_cpf_already_exists', () => { ... });
it('should_return_empty_list_when_no_clients_exist', () => { ... });
it('should_decrement_coupon_quantity_when_subscription_is_created', () => { ... });
```

## Testes Unitários (`tests/unit/`)

- Testam uma única unidade isolada: Entity, Value Object, Use Case ou Domain Service
- **Nunca** acessam banco de dados, HTTP ou serviços externos
- Usam **fakes** (implementações em memória) ou **mocks** para dependências

```typescript
// Exemplo: fake repository
class FakeClientRepository implements ClientRepository {
  private clients: ClientDomain[] = [];

  async create(client: ClientDomain): Promise<void> {
    this.clients.push(client);
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<ClientDomain | null> {
    return this.clients.find(c => c.cpfCnpj === cpfCnpj) ?? null;
  }
}
```

## Testes de Integração (`tests/integration/`)

- Testam o fluxo completo passando pelo controller até o banco de dados
- Usam banco real (ou banco em memória para PostgreSQL via Docker)
- Use `supertest` para simular requisições HTTP

## Organização do arquivo de teste

```typescript
describe('RecursoCreateUseCase', () => {
  let useCase: RecursoCreateUseCase;
  let repository: FakeRecursoRepository;

  beforeEach(() => {
    repository = new FakeRecursoRepository();
    useCase = new RecursoCreateUseCase(repository);
  });

  it('should_create_recurso_when_valid_data_is_provided', async () => {
    // Arrange
    const input = { name: 'Test', userId: 'user-1' };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.name).toBe('Test');
  });

  it('should_throw_error_when_recurso_already_exists', async () => {
    // Arrange
    await useCase.execute({ name: 'Test', userId: 'user-1' });

    // Act & Assert
    await expect(useCase.execute({ name: 'Test', userId: 'user-1' }))
      .rejects.toThrow();
  });
});
```

## Evite

- Testar detalhes de implementação (testar comportamento, não código interno)
- Testes que dependem da ordem de execução
- Múltiplos `expect` sem relação em um único teste
- Comentários explicando o que o teste faz — o nome já deve ser suficientemente descritivo
