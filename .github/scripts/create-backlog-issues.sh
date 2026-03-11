#!/bin/bash

# Script para criar issues do backlog no GitHub
# Uso: ./create-backlog-issues.sh <GITHUB_TOKEN>

REPO="allanalvescs/evolution-crm-back"
GITHUB_TOKEN="${1:-$GITHUB_TOKEN}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Erro: GITHUB_TOKEN não fornecido"
    echo "Uso: ./create-backlog-issues.sh <token>"
    echo "Ou: export GITHUB_TOKEN=<token> && ./create-backlog-issues.sh"
    exit 1
fi

API_URL="https://api.github.com/repos/$REPO/issues"

echo "🚀 Criando backlog de issues no repositório $REPO..."
echo ""

# EPIC 1: Fundação DDD
echo "📝 Criando EPIC 1..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[EPIC] Estabelecer Fundação DDD",
    "body": "## 🎯 EPIC 1: Estabelecer Fundação DDD\n\n**Prioridade:** CRÍTICA\n**Story Points:** 34\n\n### Objetivo\nEstabelecer as bases do Domain-Driven Design (DDD) no projeto, criando Value Objects, transformando entidades anêmicas em agregados ricos e implementando eventos de domínio.\n\n### User Stories Relacionadas\nVer issues com label `epic-1`\n\n### Definição de Pronto\n- ✅ Todos os Value Objects criados e testados\n- ✅ Entidade Client com comportamentos de negócio\n- ✅ Sistema de eventos funcionando\n- ✅ Cobertura de testes > 80%\n\n### Referências\n- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)\n- [Value Objects Pattern](https://martinfowler.com/bliki/ValueObject.html)",
    "labels": ["epic", "architecture", "ddd", "priority:critical"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-001: Value Objects
echo "📝 Criando US-001..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-001] Criar Value Objects do Domínio Client",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar Value Objects para CPF/CNPJ, Email, Phone, Address\n**Para que** garantir validações e imutabilidade no domínio\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar `CpfCnpj` Value Object com validação de CPF e CNPJ\n- [ ] Criar `Email` Value Object com validação de formato\n- [ ] Criar `Phone` Value Object com formatação brasileira\n- [ ] Criar `Address` Value Object composto\n- [ ] Escrever testes unitários para cada VO (100% cobertura)\n- [ ] Documentar uso dos VOs no README\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ CpfCnpj valida CPF com 11 dígitos e CNPJ com 14 dígitos\n2. ✅ CpfCnpj valida dígitos verificadores\n3. ✅ Email valida formato RFC 5322\n4. ✅ Phone aceita formatos (XX) XXXXX-XXXX e variações\n5. ✅ Todos os VOs são imutáveis (readonly properties)\n6. ✅ Lançam exceções de domínio em casos inválidos\n7. ✅ Implementam método `equals()` para comparação por valor\n8. ✅ Cobertura de testes ≥ 95%\n\n---\n\n## 🧪 Exemplos de Testes\n\n```typescript\n// CpfCnpj.spec.ts\ndescribe(\"CpfCnpj Value Object\", () => {\n  it(\"should create valid CPF\", () => {\n    const cpf = CpfCnpj.create(\"123.456.789-09\");\n    expect(cpf.value).toBe(\"12345678909\");\n    expect(cpf.isCpf()).toBe(true);\n  });\n\n  it(\"should reject invalid CPF\", () => {\n    expect(() => CpfCnpj.create(\"111.111.111-11\"))\n      .toThrow(InvalidCpfCnpjException);\n  });\n});\n```\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P0 (Crítica)\n**Epic:** #TBD - Fundação DDD",
    "labels": ["user-story", "epic-1", "ddd", "priority:p0", "points:8"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-002: Agregado Client
echo "📝 Criando US-002..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-002] Refatorar Client como Agregado Rico",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** transformar Client em agregado com comportamentos\n**Para que** encapsular regras de negócio no domínio\n\n---\n\n## 📋 Tarefas\n\n- [ ] Adicionar construtor privado + factory method `Client.create()`\n- [ ] Implementar método `updateInfo()` com validações\n- [ ] Implementar método `addAddress()` / `updateAddress()`\n- [ ] Adicionar método `deactivate()` / `activate()`\n- [ ] Garantir invariantes do agregado (ex: email único, CPF válido)\n- [ ] Implementar validação de tipo (PF deve ter nome, PJ deve ter razão social)\n- [ ] Adicionar métodos de domínio: `canBeDeleted()`, `isActive()`\n- [ ] Escrever testes unitários completos (100% cobertura)\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Construtor é privado, criação apenas via `Client.create()`\n2. ✅ Factory method valida todos os dados antes de criar\n3. ✅ Impossível criar Client em estado inválido\n4. ✅ `updateInfo()` valida dados e emite evento de atualização\n5. ✅ Address é parte do agregado, não pode existir sem Client\n6. ✅ `deactivate()` muda status e emite evento\n7. ✅ Métodos de negócio encapsulam lógica (não há setters públicos)\n8. ✅ Testes cobrem casos válidos e inválidos\n\n---\n\n## 🏗️ Estrutura Proposta\n\n```typescript\nexport class Client extends AggregateRoot {\n  private constructor(\n    private readonly id: EntityId,\n    private name: string,\n    private email: Email,\n    private cpfCnpj: CpfCnpj,\n    // ...\n  ) {}\n\n  static create(props: CreateClientProps): Client {\n    // Validações\n    // Criar instância\n    // Emitir ClientCreatedEvent\n    return client;\n  }\n\n  updateInfo(data: UpdateClientData): void {\n    // Validar\n    // Atualizar\n    // Emitir ClientUpdatedEvent\n  }\n\n  addAddress(address: Address): void {\n    // Validar\n    // Adicionar ao agregado\n  }\n\n  deactivate(): void {\n    this.status = Status.INACTIVE;\n    this.addDomainEvent(new ClientDeactivatedEvent(this.id));\n  }\n}\n```\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 13\n**Prioridade:** P0 (Crítica)\n**Epic:** #TBD - Fundação DDD\n**Depende de:** #TBD (US-001 - Value Objects)",
    "labels": ["user-story", "epic-1", "ddd", "priority:p0", "points:13"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-003: Domain Events
echo "📝 Criando US-003..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-003] Implementar Domain Events",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar eventos de domínio (ClientCreated, ClientUpdated)\n**Para que** desacoplar contextos e permitir reações assíncronas\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar classe base abstrata `DomainEvent`\n- [ ] Criar `AggregateRoot` base com gestão de eventos\n- [ ] Criar `ClientCreatedEvent` com dados do cliente\n- [ ] Criar `ClientUpdatedEvent` com dados alterados\n- [ ] Criar `ClientDeactivatedEvent`\n- [ ] Implementar `EventDispatcher` para publicar eventos\n- [ ] Integrar com infraestrutura (RabbitMQ ou in-memory)\n- [ ] Adicionar eventos aos métodos do agregado Client\n- [ ] Escrever testes unitários para eventos\n- [ ] Documentar padrão de eventos\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ `DomainEvent` contém: `eventId`, `occurredOn`, `aggregateId`\n2. ✅ `AggregateRoot` gerencia lista de eventos não publicados\n3. ✅ Eventos são imutáveis (readonly)\n4. ✅ `EventDispatcher` publica eventos após commit da transação\n5. ✅ Handlers podem ser registrados para cada tipo de evento\n6. ✅ Client emite eventos em operações de criação/atualização/desativação\n7. ✅ Eventos incluem todos os dados relevantes (não apenas IDs)\n8. ✅ Testes verificam que eventos são emitidos corretamente\n\n---\n\n## 🏗️ Estrutura Proposta\n\n```typescript\n// domain/shared/domain-event.ts\nexport abstract class DomainEvent {\n  readonly eventId: string;\n  readonly occurredOn: Date;\n  readonly aggregateId: string;\n\n  constructor(aggregateId: string) {\n    this.eventId = crypto.randomUUID();\n    this.occurredOn = new Date();\n    this.aggregateId = aggregateId;\n  }\n\n  abstract eventName(): string;\n}\n\n// domain/client/events/client-created.event.ts\nexport class ClientCreatedEvent extends DomainEvent {\n  constructor(\n    aggregateId: string,\n    readonly clientData: {\n      name: string;\n      email: string;\n      cpfCnpj: string;\n      // ...\n    }\n  ) {\n    super(aggregateId);\n  }\n\n  eventName(): string {\n    return \"client.created\";\n  }\n}\n\n// domain/shared/aggregate-root.ts\nexport abstract class AggregateRoot {\n  private domainEvents: DomainEvent[] = [];\n\n  protected addDomainEvent(event: DomainEvent): void {\n    this.domainEvents.push(event);\n  }\n\n  public pullDomainEvents(): DomainEvent[] {\n    const events = [...this.domainEvents];\n    this.domainEvents = [];\n    return events;\n  }\n}\n```\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P1 (Alta)\n**Epic:** #TBD - Fundação DDD",
    "labels": ["user-story", "epic-1", "ddd", "priority:p1", "points:8"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-004: Domain Services
echo "📝 Criando US-004..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-004] Criar Domain Services",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar serviços de domínio para lógicas complexas\n**Para que** manter entidades focadas em seu estado\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar `ClientValidationDomainService`\n- [ ] Mover validação de duplicidade de CPF/CNPJ para domain service\n- [ ] Criar método `validateUniqueEmail()`\n- [ ] Criar método `canClientBeDeleted()` (verificar dependências)\n- [ ] Escrever testes unitários para domain services\n- [ ] Documentar quando usar Domain Service vs Entity\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Domain Service não tem estado (stateless)\n2. ✅ Recebe repositórios via construtor (DI)\n3. ✅ Contém lógica que envolve múltiplas entidades ou agregados\n4. ✅ Validação de duplicidade está no domain service\n5. ✅ Nome do serviço expressa operação de domínio\n6. ✅ Não depende de infraestrutura diretamente\n7. ✅ Testes mockam repositórios\n\n---\n\n## 🏗️ Estrutura Proposta\n\n```typescript\n// domain/client/domain-services/client-validation.service.ts\nexport class ClientValidationDomainService {\n  constructor(\n    private readonly clientRepository: IClientRepository\n  ) {}\n\n  async validateUniqueCpfCnpj(\n    cpfCnpj: CpfCnpj,\n    excludeClientId?: EntityId\n  ): Promise<void> {\n    const existing = await this.clientRepository\n      .findByCpfCnpj(cpfCnpj.value);\n\n    if (existing && existing.id !== excludeClientId) {\n      throw new DuplicateCpfCnpjException(\n        \"Já existe um cliente com este CPF/CNPJ\"\n      );\n    }\n  }\n\n  async canClientBeDeleted(clientId: EntityId): Promise<boolean> {\n    // Verificar se tem pedidos, contratos, etc\n    return true;\n  }\n}\n```\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 5\n**Prioridade:** P1 (Alta)\n**Epic:** #TBD - Fundação DDD",
    "labels": ["user-story", "epic-1", "ddd", "priority:p1", "points:5"]
  }' | jq -r '.number // "erro"'

sleep 1

# EPIC 2: Clean Architecture
echo "📝 Criando EPIC 2..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[EPIC] Corrigir Clean Architecture",
    "body": "## 🏗️ EPIC 2: Corrigir Clean Architecture\n\n**Prioridade:** ALTA\n**Story Points:** 21\n\n### Objetivo\nReorganizar o código para aderir aos princípios de Clean Architecture, garantindo separação correta de camadas e inversão de dependências.\n\n### User Stories Relacionadas\nVer issues com label `epic-2`\n\n### Violações Atuais Identificadas\n1. ❌ Controllers misturados com lógica de negócio\n2. ❌ Services na camada de módulos acessando infrastructure\n3. ❌ UseCases incompletos\n4. ❌ Dependências invertidas (Application → Infrastructure)\n\n### Definição de Pronto\n- ✅ Controllers isolados em `interface/http/`\n- ✅ UseCases com lógica completa\n- ✅ Inversão de dependências corrigida\n- ✅ Zero violações arquiteturais",
    "labels": ["epic", "architecture", "clean-architecture", "priority:high"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-005: Separar Interface Layer
echo "📝 Criando US-005..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-005] Separar Camada de Interface",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** mover controllers para camada `interface/http/rest`\n**Para que** respeitar separação de camadas da Clean Architecture\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar estrutura `src/interface/http/rest/{module}/`\n- [ ] Mover `ClientController` para `interface/http/rest/client/`\n- [ ] Mover `AuthController` para `interface/http/rest/auth/`\n- [ ] Mover `UserController` para `interface/http/rest/user/`\n- [ ] Mover guards para `interface/http/guards/`\n- [ ] Mover filters para `interface/http/filters/`\n- [ ] Mover interceptors para `interface/http/interceptors/`\n- [ ] Mover decorators HTTP para `interface/http/decorators/`\n- [ ] Atualizar todos os imports\n- [ ] Rodar testes para garantir que nada quebrou\n- [ ] Atualizar documentação\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Nenhum controller em `src/modules/`\n2. ✅ Estrutura organizada: `interface/http/rest/{module}/`\n3. ✅ Guards/Filters/Interceptors em subpastas de `interface/http/`\n4. ✅ DTOs de request/response em `interface/http/rest/{module}/dtos/`\n5. ✅ Todos os testes passando\n6. ✅ Imports atualizados\n7. ✅ Swagger funcionando\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P0 (Crítica)\n**Epic:** #TBD - Clean Architecture",
    "labels": ["user-story", "epic-2", "clean-architecture", "priority:p0", "points:8", "refactor"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-006: Refatorar UseCases
echo "📝 Criando US-006..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-006] Refatorar UseCases com Lógica Completa",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** implementar lógica completa em `ClientCreateUseCase`\n**Para que** UseCases orquestrem o fluxo completo de negócio\n\n---\n\n## 📋 Tarefas\n\n- [ ] Implementar criação completa de Client no UseCase\n- [ ] Remover lógica de `ClientService` (deletar arquivo)\n- [ ] Adicionar chamada ao `ClientValidationDomainService`\n- [ ] Disparar eventos de domínio após criar\n- [ ] Implementar transação (Unit of Work)\n- [ ] Criar `UpdateClientUseCase` completo\n- [ ] Criar `DeleteClientUseCase` completo\n- [ ] Criar `GetClientUseCase` completo\n- [ ] Criar `ListClientsUseCase` completo\n- [ ] Escrever testes unitários para cada UseCase\n- [ ] Controllers devem chamar UseCases diretamente\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ UseCase orquestra todo o fluxo: validação → criação → persistência → eventos\n2. ✅ Services em `modules/` foram removidos\n3. ✅ Controllers apenas chamam UseCases e mapeiam DTOs\n4. ✅ UseCases não conhecem detalhes de HTTP (não recebem Request/Response)\n5. ✅ Transações são gerenciadas no UseCase\n6. ✅ Eventos são publicados após commit\n7. ✅ Testes cobrem casos de sucesso e erro\n\n---\n\n## 🏗️ Exemplo de UseCase Completo\n\n```typescript\nexport class CreateClientUseCase {\n  constructor(\n    private readonly clientRepository: IClientRepository,\n    private readonly validationService: ClientValidationDomainService,\n    private readonly eventDispatcher: IEventDispatcher,\n    private readonly cnpjService: ICnpjService,\n    private readonly unitOfWork: IUnitOfWork\n  ) {}\n\n  async execute(command: CreateClientCommand): Promise<ClientDto> {\n    await this.unitOfWork.start();\n\n    try {\n      // 1. Consultar serviço externo (se necessário)\n      if (command.cpfCnpj.isCnpj()) {\n        await this.cnpjService.consult(command.cpfCnpj.value);\n      }\n\n      // 2. Validar regras de domínio\n      await this.validationService.validateUniqueCpfCnpj(\n        command.cpfCnpj\n      );\n\n      // 3. Criar agregado\n      const client = Client.create({\n        userId: command.userId,\n        name: command.name,\n        email: command.email,\n        cpfCnpj: command.cpfCnpj,\n        // ...\n      });\n\n      // 4. Persistir\n      await this.clientRepository.save(client);\n\n      // 5. Commit e publicar eventos\n      await this.unitOfWork.commit();\n\n      const events = client.pullDomainEvents();\n      events.forEach(event => this.eventDispatcher.dispatch(event));\n\n      return ClientDto.fromDomain(client);\n    } catch (error) {\n      await this.unitOfWork.rollback();\n      throw error;\n    }\n  }\n}\n```\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P0 (Crítica)\n**Epic:** #TBD - Clean Architecture",
    "labels": ["user-story", "epic-2", "clean-architecture", "priority:p0", "points:8"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-007: Inverter Dependências
echo "📝 Criando US-007..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-007] Inverter Dependência de Serviços Externos",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar interface `ICnpjService` na camada Application\n**Para que** Application não dependa de Infrastructure\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar `ICnpjService` interface em `application/shared/interfaces/`\n- [ ] Implementar em `infrastructure/external-services/cnpj/`\n- [ ] Injetar via DI nos UseCases\n- [ ] Remover importação direta de `CnpjService` em qualquer UseCase\n- [ ] Aplicar mesmo padrão para outros serviços externos (se houver)\n- [ ] Configurar binding no módulo NestJS\n- [ ] Escrever testes mockando a interface\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Interface `ICnpjService` está em `application/`\n2. ✅ Implementação concreta está em `infrastructure/`\n3. ✅ UseCases dependem apenas da interface\n4. ✅ DI configurada corretamente no NestJS\n5. ✅ Testes mockam a interface, não a implementação\n6. ✅ Fácil substituir implementação (ex: mock service em testes)\n\n---\n\n## 🏗️ Estrutura Proposta\n\n```typescript\n// application/shared/interfaces/cnpj-service.interface.ts\nexport interface ICnpjService {\n  consult(cnpj: string): Promise<CnpjData>;\n}\n\n// infrastructure/external-services/cnpj/cnpj.service.ts\n@Injectable()\nexport class CnpjService implements ICnpjService {\n  async consult(cnpj: string): Promise<CnpjData> {\n    // Implementação com API externa\n  }\n}\n\n// Module binding\n@Module({\n  providers: [\n    {\n      provide: \"ICnpjService\",\n      useClass: CnpjService\n    }\n  ]\n})\n```\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 5\n**Prioridade:** P0 (Crítica)\n**Epic:** #TBD - Clean Architecture",
    "labels": ["user-story", "epic-2", "clean-architecture", "priority:p0", "points:5"]
  }' | jq -r '.number // "erro"'

sleep 1

# EPIC 3: Cobertura de Testes
echo "📝 Criando EPIC 3..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[EPIC] Cobertura de Testes",
    "body": "## 🧪 EPIC 3: Cobertura de Testes\n\n**Prioridade:** ALTA\n**Story Points:** 34\n\n### Objetivo\nAlcançar cobertura de testes de 80%+ em todas as camadas, com foco em testes unitários para domínio e application, testes de integração para infrastructure, e testes E2E para fluxos completos.\n\n### User Stories Relacionadas\nVer issues com label `epic-3`\n\n### Situação Atual\n- ✅ Auth module: ~80% cobertura\n- ✅ User module: ~60% cobertura\n- ❌ Client module: 0% cobertura\n- ❌ Domain entities: 0% cobertura\n- ❌ UseCases: 0% cobertura\n- ❌ Repositories: 0% testes de integração\n- ❌ E2E: 0% implementado\n\n### Meta\n- 🎯 Cobertura geral: 80%+\n- 🎯 Domain layer: 95%+\n- 🎯 Application layer: 85%+\n- 🎯 Infrastructure layer: 70%+",
    "labels": ["epic", "testing", "priority:high"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-008: Testes Domain
echo "📝 Criando US-008..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-008] Testes Unitários - Domain Layer",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar testes unitários para entidades de domínio\n**Para que** garantir comportamentos corretos e invariantes\n\n---\n\n## 📋 Tarefas\n\n- [ ] Testes para `Client` entity (100% cobertura)\n  - [ ] Testes de criação (factory method)\n  - [ ] Testes de atualização\n  - [ ] Testes de validação de invariantes\n  - [ ] Testes de eventos emitidos\n- [ ] Testes para `ClientAddress` entity\n- [ ] Testes para `User` entity\n- [ ] Testes para Value Objects\n  - [ ] `CpfCnpj.spec.ts`\n  - [ ] `Email.spec.ts`\n  - [ ] `Phone.spec.ts`\n  - [ ] `Address.spec.ts`\n- [ ] Testes para Domain Services\n  - [ ] `ClientValidationDomainService.spec.ts`\n- [ ] Testes para Domain Events\n  - [ ] `ClientCreatedEvent.spec.ts`\n  - [ ] `ClientUpdatedEvent.spec.ts`\n- [ ] Configurar cobertura mínima no Jest (95%)\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Cobertura de domain layer ≥ 95%\n2. ✅ Todos os métodos públicos testados\n3. ✅ Casos de borda cobertos (validações, erros)\n4. ✅ Testes não dependem de infraestrutura\n5. ✅ Testes são rápidos (< 1s para rodar todos)\n6. ✅ Nomenclatura clara: `should [ação] when [condição]`\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 13\n**Prioridade:** P0 (Crítica)\n**Epic:** #TBD - Testes",
    "labels": ["user-story", "epic-3", "testing", "unit-test", "priority:p0", "points:13"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-009: Testes Application
echo "📝 Criando US-009..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-009] Testes Unitários - Application Layer",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar testes para UseCases de Client\n**Para que** garantir orquestração correta do fluxo de negócio\n\n---\n\n## 📋 Tarefas\n\n- [ ] `CreateClientUseCase.spec.ts`\n  - [ ] Cenário de sucesso\n  - [ ] CPF/CNPJ duplicado\n  - [ ] Validação de dados inválidos\n  - [ ] Erro ao consultar CNPJ externo\n  - [ ] Erro ao persistir\n- [ ] `UpdateClientUseCase.spec.ts`\n- [ ] `DeleteClientUseCase.spec.ts`\n- [ ] `GetClientUseCase.spec.ts`\n- [ ] `ListClientsUseCase.spec.ts`\n- [ ] Testar que eventos são emitidos\n- [ ] Testar rollback em caso de erro\n- [ ] Mockar todas as dependências (repositories, services)\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Cobertura de UseCases ≥ 85%\n2. ✅ Cenários de sucesso e erro testados\n3. ✅ Mocks configurados corretamente\n4. ✅ Testes verificam interações (chamadas a repositórios)\n5. ✅ Testes verificam emissão de eventos\n6. ✅ Testes rápidos (< 2s total)\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 13\n**Prioridade:** P1 (Alta)\n**Epic:** #TBD - Testes",
    "labels": ["user-story", "epic-3", "testing", "unit-test", "priority:p1", "points:13"]
  }' | jq -r '.number // "erro"'

sleep 1

# US-010: Testes Integração
echo "📝 Criando US-010..."
curl -s -X POST "$API_URL" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "[US-010] Testes de Integração - Infrastructure",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar testes de integração para repositórios\n**Para que** validar persistência com BD real\n\n---\n\n## 📋 Tarefas\n\n- [ ] Setup de BD de teste (Docker Compose ou TestContainers)\n- [ ] Configurar Jest para testes de integração\n- [ ] `ClientRepository.integration.spec.ts`\n  - [ ] Testar `save()`\n  - [ ] Testar `findById()`\n  - [ ] Testar `findByCpfCnpj()`\n  - [ ] Testar `update()`\n  - [ ] Testar `delete()`\n- [ ] `UserRepository.integration.spec.ts`\n- [ ] Testar mappers (Domain ↔ ORM)\n- [ ] Limpar BD entre testes\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Banco de dados isolado para testes\n2. ✅ Testes rodam em transações (rollback automático)\n3. ✅ Repositories testados contra BD real (Postgres)\n4. ✅ Mappers validados\n5. ✅ Testes podem rodar em paralelo\n6. ✅ Script no package.json: `npm run test:integration`\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P1 (Alta)\n**Epic:** #TBD - Testes",
    "labels": ["user-story", "epic-3", "testing", "integration-test", "priority:p1", "points:8"]
  }' | jq -r '.number // "erro"'

echo ""
echo "✅ Issues criadas com sucesso!"
echo "📊 Acesse: https://github.com/$REPO/issues"
