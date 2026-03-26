# Diretrizes de Desenvolvimento Assistido por IA

Você está auxiliando no desenvolvimento deste projeto como um **engenheiro de software assistido por IA**.

Seu objetivo é gerar **código pronto para produção**, respeitando a arquitetura do projeto, estratégia de testes e padrões de engenharia definidos.

Sempre priorize:

* Manutenibilidade
* Testabilidade
* Clareza do domínio
* Consistência arquitetural

Evite gerar código que viole as regras de arquitetura ou que introduza complexidade desnecessária.

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

---

# Domain Driven Design (DDD)

Ao implementar regras de negócio:

* Modele as regras de negócio dentro de **Entities** ou **Value Objects**
* Utilize **Use Cases (Application Services)** para orquestrar fluxos
* Evite colocar lógica de negócio em controllers ou infraestrutura

Padrões recomendados:

* Entities
* Value Objects
* Enums de domínio
* Aggregates
* Domain Services
* Repositories (interfaces apenas no Domain)

Implementações concretas de repositórios devem existir **apenas na camada Infrastructure**.

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

> **Regra importante**: Enums como `EUserRole`, `EClientType` e `EStatus` pertencem ao Domain e devem ficar em `src/domain/enums/`. **Nunca** importar do Domain para `src/shared/`.

---

# Estratégia de Testes (TDD)

O desenvolvimento deve seguir **Test Driven Development (TDD)**.

Fluxo de implementação:

1. Escreva um teste que falha
2. Implemente o mínimo de código necessário para o teste passar
3. Refatore mantendo todos os testes passando

Regras:

* Todo **Use Case deve possuir testes unitários**
* Regras de negócio devem ser testadas de forma isolada
* Evite testar frameworks ou infraestrutura em testes unitários
* Utilize **mocks ou fakes** para dependências externas

Estrutura de testes — localizada na **raiz do projeto** (fora de `src/`):

```
tests/
├── unit/          (testes de entities, value objects, use cases, domain services)
└── integration/   (testes de controllers, repositórios com banco real)
```

> **Nunca** criar arquivos `.spec.ts` ou `.test.ts` dentro de `src/`. Todos os testes ficam em `tests/`.

Padrão de nomenclatura de testes:

```
should_<comportamento_esperado>_when_<condicao>
```

Exemplos:

```
should_create_user_when_valid_data_is_provided
should_throw_error_when_email_already_exists
should_return_empty_list_when_no_clients_exist
```

---

# Estilo de Código

Utilize **TypeScript com strict mode habilitado**.

Diretrizes gerais:

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

# Desenvolvimento Assistido por IA (Integração com MCP)

Quando ferramentas MCP estiverem disponíveis, utilize-as para:

* Analisar o contexto do repositório
* Entender padrões existentes no código
* Identificar arquitetura e organização dos módulos
* Auxiliar na geração de planos de implementação
* Utilizar **context7** MCP para consultar ferramentas de desenvolvimento a serem utilizados no projeto
  * NestJS, RabbitMQ, Redis, supertest, jest, Mikro-ORM, 

Antes de gerar novas implementações:

1. Analise módulos existentes
2. Reutilize padrões já presentes no projeto
3. Mantenha consistência arquitetural

Evite introduzir novos padrões arquiteturais sem justificativa clara.

---

# Fluxo de Implementação

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

## Validators e Domain Services

* **Validators de regras de negócio** (ex: verificar se email já existe) → `src/domain/services/`
* **Validators de formato/entrada** (ex: CPF válido) → podem estar em `src/shared/validator/` se forem genéricos

---

# Workflow Git

Branches devem ser criadas a partir da branch:

develop

Padrões de nomenclatura:

feature/<nome-da-funcionalidade>
fix/<descricao-do-bug>
refactor/<contexto-da-refatoracao>

---

# Commits

As mensagens de commit devem seguir **Conventional Commits**.

Exemplos:

feat(auth): adiciona autenticação JWT
fix(user): corrige validação de email
refactor(order): simplifica lógica do agregado de pedidos
test(payment): adiciona testes para serviço de pagamento

Commits devem ser:

* pequenos
* focados
* descritivos

---

# Pull Requests

Antes de abrir um Pull Request:

* Todos os testes devem estar passando
* Não devem existir erros de lint
* O código deve respeitar as regras de arquitetura

Execute:

npm run lint:fix && npm test

---

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
