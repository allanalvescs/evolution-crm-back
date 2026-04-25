# Diretrizes de Desenvolvimento Assistido por IA

Você está auxiliando no desenvolvimento deste projeto como um **engenheiro de software assistido por IA**.

Seu objetivo é gerar **código pronto para produção**, respeitando a arquitetura do projeto, estratégia de testes e padrões de engenharia definidos.

Sempre priorize:

* Manutenibilidade
* Testabilidade
* Clareza do domínio
* Consistência arquitetural

Evite gerar código que viole as regras de arquitetura ou que introduza complexidade desnecessária.

> **Regras escopadas por contexto de arquivo:**
> - Controllers → `.copilot/rules/controller-instruction.md`
> - Use Cases → `.copilot/rules/usecase-instruction.md`
> - Domain (entities, value objects, enums) → `.copilot/rules/domain-instruction.md`
> - Testes → `.copilot/rules/testing-instruction.md`
> - Git Workflow (branches, commits, pull requests) → `.copilot/rules/workflow-git.md`

---

# Princípios de Arquitetura

Este projeto segue **Clean Architecture** e **Domain Driven Design (DDD)**.

Todas as implementações devem respeitar as seguintes camadas:

* Domain
* Application
* Infrastructure
* Interface / Presentation

Regra de dependência:

Camadas internas **NUNCA devem depender de camadas externas**.

Direção permitida de dependência:

Interface → Application → Domain
Infrastructure → Application → Domain

A camada **Domain deve permanecer pura**, sem dependência de frameworks, bibliotecas externas ou infraestrutura.

## Estrutura esperada das camadas

```
src/
├── domain/
│   ├── entities/          (Entidades de domínio puras)
│   ├── value-objects/     (Value Objects com validação)
│   ├── enums/             (Enums que pertencem ao domínio: roles, tipos, status)
│   ├── repositories/      (Interfaces de repositório — sem implementação)
│   ├── services/          (Domain Services e Validators de regras de negócio)
│   └── contracts/         (Interfaces de serviços externos: hasher, token, etc.)
│
├── applications/
│   └── usecases/          (Use Cases que orquestram o domínio)
│
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/      (Entidades ORM — MikroORM @Entity)
│   │   ├── repositories/  (Implementações concretas dos repositórios do domínio)
│   │   └── mappers/       (Tradução entre entidade de domínio e entidade ORM)
│   └── services/          (Implementações concretas de contracts: bcrypt, jwt, etc.)
│
├── modules/               (Interface / Presentation)
│   └── <modulo>/
│       ├── <modulo>.module.ts
│       ├── <modulo>.controller.ts
│       ├── service/       (Orquestração de Use Cases — sem lógica de negócio)
│       └── dtos/          (DTOs de entrada e saída da API)
│
└── shared/                (Cross-cutting concerns: decorators, guards, utilitários)
    ├── decorators/
    └── services/          (Serviços utilitários não pertencentes ao domínio)
```

---

# REST API

Este projeto é uma **API REST**. Todas as implementações devem seguir as boas práticas REST.

## Verbos HTTP

| Verbo | Uso |
|---|---|
| `GET` | Leitura de recursos (não modifica estado) |
| `POST` | Criação de um novo recurso |
| `PUT` | Substituição completa de um recurso |
| `PATCH` | Atualização parcial de um recurso |
| `DELETE` | Remoção de um recurso |

## Status codes semânticos

| Código | Quando usar |
|---|---|
| `200 OK` | Requisição bem-sucedida com corpo de resposta |
| `201 Created` | Recurso criado com sucesso |
| `204 No Content` | Operação bem-sucedida sem corpo de resposta (ex: DELETE) |
| `400 Bad Request` | Dados de entrada inválidos |
| `401 Unauthorized` | Token ausente ou inválido |
| `403 Forbidden` | Autenticado, mas sem permissão para a ação |
| `404 Not Found` | Recurso não encontrado |
| `409 Conflict` | Conflito de dados (ex: email ou CPF já cadastrado) |
| `422 Unprocessable Entity` | Dados válidos em formato mas com regra de negócio violada |
| `500 Internal Server Error` | Erro não tratado no servidor |

## Nomenclatura de rotas

* Use **substantivos no plural** para representar coleções: `/clients`, `/plans`, `/coupons`
* Use **kebab-case** para recursos compostos: `/subscription-items`
* **Nunca** use verbos nas rotas: ~~`/createClient`~~, ~~`/getPlans`~~
* Rotas aninhadas para recursos dependentes: `/clients/:id/subscriptions`
* Prefixe com versão: `/v1/clients`

## Respostas

* Toda resposta deve usar um **DTO tipado** (`*-sc.dto.ts`)
* Erros devem retornar um objeto consistente com `message` e `statusCode`
* Nunca exponha detalhes internos (stack trace, queries SQL) em respostas de erro


# Estilo de Código

## TypeScript Strict Mode

**Todo o código deve ser escrito com TypeScript em modo strict.** Isso é inegociável.

```json
// tsconfig.json
{ "compilerOptions": { "strict": true } }
```

Isso implica obrigatoriamente:

* Sem `any` explícito — use tipos precisos ou `unknown` com narrowing
* Tipagem explícita em parâmetros e retornos de funções públicas
* Sem acesso a propriedades possivelmente `undefined` sem checagem

## Diretrizes gerais

* Utiliza bem as boas práticas da Programação Orientada a Objeto (POO)
* Mantenha métodos pequenos e com responsabilidade única sempre que possivel
* Evite lógica profundamente aninhada
* Utilize tipagem explícita sempre que possível
* Siga o princípios do **SOLID**


Evite:

* Classes gigantes (God classes)
* Controllers com lógica de negócio
* Misturar regras de domínio com infraestrutura

---

# Validação de Documentação

Use a ferramenta **context7** MCP para pesquisar e validar as APIs do NestJS, mikro-orm, class-validator e outras bibliotecas antes de implementar estruturas. Isso garante que as implementações sigam as convenções atuais da biblioteca e evitem padrões obsoletos.

Evite introduzir novos padrões arquiteturais sem justificativa clara.

---

# Fluxo de Implementação
Antes de gerar novas implementações:

1. Analise módulos existentes
2. Reutilize padrões já presentes no projeto
3. Mantenha consistência arquitetural

Ao implementar uma funcionalidade:

1. Entenda o requisito de domínio (consulte `docs/Produto.md`)
2. Crie ou atualize modelos de domínio em `src/domain/` (entities, value objects, enums, interfaces de repositório)
3. Implemente o Use Case em `src/applications/usecases/<modulo>/`
4. Escreva testes unitários em `tests/unit/` antes de implementar a infraestrutura
5. Implemente adaptadores de infraestrutura em `src/infrastructure/persistence/` (ORM entity, mapper, repositório concreto)
6. Exponha a funcionalidade em `src/modules/<modulo>/` (controller + service de orquestração + DTOs)

Garanta que:

* A lógica de domínio permaneça independente de frameworks
* Regras de negócio permaneçam no domínio
* Infraestrutura seja facilmente substituível



## Cobertura de testes obrigatória

**Toda funcionalidade implementada deve ter testes.** Não existe código em produção sem teste correspondente.

| Componente | Tipo de teste | Onde |
|---|---|---|
| Entities e Value Objects | Unitário | `tests/unit/domain/` |
| Domain Services / Validators | Unitário | `tests/unit/domain/` |
| Use Cases | Unitário | `tests/unit/usecases/` |
| Controllers | Integração | `tests/integration/` |



# Documentação Técnica

Após implementar mudanças relevantes:

Atualize a documentação técnica localizada em:

```
docs/
```

A documentação deve incluir:

* Descrição da funcionalidade
* Decisões arquiteturais relevantes
* Modelos de domínio criados ou alterados
* Estratégia de testes utilizada

Prefira documentação técnica curta, objetiva e voltada para desenvolvedores.

---

# Diretrizes de Comportamento da IA

Ao gerar código:

Prefira:

* soluções simples
* padrões existentes no projeto
* código modular e testável

Evite:

* abstrações desnecessárias
* over-engineering
* mistura de camadas arquiteturais

Quando houver incerteza sobre o comportamento do domínio, prefira **gerar testes primeiro**.
