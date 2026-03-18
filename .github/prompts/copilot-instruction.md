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
* Aggregates
* Domain Services
* Repositories (interfaces apenas no Domain ou Application)

Implementações concretas de repositórios devem existir **apenas na camada Infrastructure**.

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

Estrutura de testes recomendada:

tests/
unit/
integration/

Padrão de nomenclatura de testes:

should_<comportamento_esperado>*when*<condicao>

Exemplo:

should_create_user_when_valid_data_is_provided

---

# Estilo de Código

Utilize **TypeScript com strict mode habilitado**.

Diretrizes gerais:

* Prefira programação funcional sempre que possível
* Evite classes quando funções simples forem suficientes
* Mantenha funções pequenas e com responsabilidade única
* Evite lógica profundamente aninhada
* Utilize tipagem explícita sempre que possível
* Siga o princípio **Single Responsibility Principle (SRP)**

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

Antes de gerar novas implementações:

1. Analise módulos existentes
2. Reutilize padrões já presentes no projeto
3. Mantenha consistência arquitetural

Evite introduzir novos padrões arquiteturais sem justificativa clara.

---

# Fluxo de Implementação

Ao implementar uma funcionalidade:

1. Entenda o requisito de domínio
2. Crie ou atualize modelos de domínio se necessário
3. Implemente o Use Case
4. Escreva testes unitários
5. Implemente adaptadores de infraestrutura
6. Exponha a funcionalidade através da camada de interface (API ou controller)

Garanta que:

* A lógica de domínio permaneça independente de frameworks
* Regras de negócio permaneçam no domínio
* Infraestrutura seja facilmente substituível

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

.github/docs/

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
