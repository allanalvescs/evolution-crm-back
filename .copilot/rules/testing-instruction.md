---
applyTo: 
  - "tests/**/*.e2e-test.ts"
  - "tests/**/*.test.ts"
  - "tests/**/*.int.test.ts"
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
├── integration/   (repositórios com banco real, integrações externas)
└── e2e/           (fluxos completos de ponta a ponta via HTTP)
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

## Testes Unitários (`*.test.ts`)

- Testam uma única unidade isolada: Entity, Value Object, Use Case ou Domain Service
- Dependências **externas** (banco de dados, HTTP, serviços externos) devem ser substituídas por **fakes** ou **mocks**
- Dependências internas (outras classes, estruturas de domínio) podem ser instanciadas diretamente — não é obrigatório mockar tudo
- Um artefato pode ter tanto testes unitários quanto de integração: use os unitários para comportamentos básicos e edge cases de domínio, e os de integração para validar a comunicação com dependências externas

```typescript
// Exemplo: fake repository (dependência externa)
class FakeClientRepository implements ClientRepository {
  private clients: ClientDomain[] = [];

  async create(client: ClientDomain): Promise<void> {
    this.clients.push(client);
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<ClientDomain | null> {
    return this.clients.find(c => c.cpfCnpj === cpfCnpj) ?? null;
  }
}

// Exemplo: dependência interna instanciada diretamente (sem mock)
const cpfValueObject = new Cpf('123.456.789-09');
const client = new ClientDomain({ name: 'John', cpf: cpfValueObject });
```

## Testes de Integração (`*.int.test.ts`)

- Testam a integração de um artefato com dependências externas reais (banco de dados, APIs, etc.)
- Usam banco real (ou instância isolada via Docker/test container)
- Devem preparar o estado necessário antes de cada teste e limpar após
- Podem coexistir com testes unitários do mesmo artefato, testando aspectos complementares

```typescript
// Exemplo: teste de integração de repositório com banco real
describe('ClientRepository (integration)', () => {
  beforeEach(async () => {
    await db.clearTable('clients');
  });

  it('should_persist_client_when_create_is_called', async () => {
    const client = ClientDomain.create({ name: 'John', cpfCnpj: '123.456.789-09' });
    await repository.create(client);

    const found = await repository.findByCpfCnpj('123.456.789-09');
    expect(found).not.toBeNull();
    expect(found!.name).toBe('John');
  });
});
```

## Testes E2E (`*.e2e-test.ts`)

- Testam o sistema de **ponta a ponta**, simulando o fluxo real de um cliente HTTP
- Devem preparar o banco de dados antes de cada cenário (seed / limpeza)
- Realizam chamadas HTTP reais com `supertest` e avaliam:
  - **Status code** retornado
  - **Corpo da resposta** (dados recebidos)
  - **Erros e mensagens** de erro esperados
- Cobrem o caminho feliz e os principais cenários de erro

```typescript
describe('POST /clients (e2e)', () => {
  beforeEach(async () => {
    await db.clearTable('clients');
  });

  it('should_return_201_when_client_is_created_successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/clients')
      .send({ name: 'John', cpfCnpj: '123.456.789-09' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John');
  });

  it('should_return_409_when_cpf_already_exists', async () => {
    await request(app.getHttpServer())
      .post('/clients')
      .send({ name: 'John', cpfCnpj: '123.456.789-09' });

    const response = await request(app.getHttpServer())
      .post('/clients')
      .send({ name: 'Jane', cpfCnpj: '123.456.789-09' });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/already exists/i);
  });

  it('should_return_400_when_cpf_is_invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/clients')
      .send({ name: 'John', cpfCnpj: 'invalid' });

    expect(response.status).toBe(400);
  });
});
```

## Filosofia dos testes

Testes não são apenas verificações lineares de caminho feliz. Seu objetivo é:

- **Descobrir bugs** antes que cheguem à produção
- **Validar comportamentos** esperados e inesperados
- **Documentar** o contrato do artefato (o que ele faz e o que não faz)
- **Cobrir edge cases** (valores limítrofes, entradas inválidas, estados inesperados)

Por isso, **cada teste deve validar exatamente um cenário**. Não agrupe múltiplas verificações não relacionadas em um único `it`. Prefira vários testes pequenos e focados a um teste grande e genérico.

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

  it('should_throw_error_when_name_is_empty', async () => {
    await expect(useCase.execute({ name: '', userId: 'user-1' }))
      .rejects.toThrow();
  });
});
```

## Evite

- Testar detalhes de implementação (testar comportamento, não código interno)
- Testes que dependem da ordem de execução
- Múltiplos `expect` não relacionados em um único teste — separe em testes distintos
- Comentários explicando o que o teste faz — o nome já deve ser suficientemente descritivo
- Mockar dependências internas desnecessariamente — reserve mocks para dependências externas
