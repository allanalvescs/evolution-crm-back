# Instruções de Refatoração — Evolution CRM

> Este documento define **como o processo de refatoração deve ser conduzido** neste projeto.
> Não contém tarefas específicas — o backlog de refatoração está em `docs/tasks/refactor.md`.

---

## Princípio Fundamental

Refatoração **nunca altera comportamento externo**. O sistema deve funcionar exatamente da mesma forma antes e depois de cada mudança. Qualquer refatoração que introduza novo comportamento deixou de ser refatoração e se tornou implementação — trate-as separadamente.

---

## Quando Refatorar

Refatore **antes** de implementar uma nova funcionalidade que passa pelo mesmo fluxo do código que precisa ser corrigido. Nunca misture refatoração e nova funcionalidade no mesmo commit ou branch.

---

## Processo de Refatoração

### 1. Entender antes de mudar

Antes de alterar qualquer arquivo:

- Leia o contrato atual do artefato (interface, assinaturas, comportamentos)
- Identifique todos os pontos que o importam ou dependem dele
- Mapeie os testes existentes que cobrem o artefato

### 2. Garantir cobertura de testes antes da mudança

Se o artefato a ser refatorado não possui testes, **escreva os testes primeiro**.
A refatoração sem testes é uma reescrita com risco.

### 3. Executar em incrementos pequenos

Cada passo de refatoração deve:

- Ser um commit isolado e focado
- Manter o projeto compilando e todos os testes passando ao final do commit
- Seguir a convenção: `refactor(<contexto>): <descrição curta>`

### 4. Validar após cada passo

Após cada mudança:

```
npm run lint:fix && npm test
```

Nunca acumule múltiplas refatorações sem rodar os testes entre elas.

---

## Ordem de Precedência das Refatorações

Siga a sequência abaixo para minimizar riscos de quebra entre etapas:

```
1. Estrutura de pastas e organização de arquivos
     ↓
2. Camada de Domínio (entities, enums, value objects, validators)
     ↓
3. Camada de Infraestrutura (mappers, repositórios, implementações)
     ↓
4. Camada de Aplicação (use cases, validators de application)
     ↓
5. Camada de Módulos / Apresentação (services, controllers, DTOs)
     ↓
6. Testes (mover, renomear, complementar)
```

A camada mais interna (Domínio) deve ser estabilizada antes de tocar nas externas, pois mudanças no domínio propagam efeitos para todas as outras camadas.

---

## Regras Durante a Refatoração

### Respeite as fronteiras de camada

Ao mover ou reescrever um artefato, certifique-se de que as regras de dependência são cumpridas:

- **Domain** não importa de nenhuma camada externa (`shared`, `infrastructure`, `modules`, `applications`)
- **Application** importa apenas de `domain`
- **Infrastructure** implementa contratos de `domain`
- **Modules** orquestram `applications` e expõem via HTTP

### Nunca misture camadas no mesmo arquivo

Se durante a refatoração você perceber que um arquivo mistura responsabilidades de camadas diferentes (ex: lógica de negócio em controller), separe em arquivos distintos — não tente "limpar" mantendo tudo no mesmo lugar.

### Mantenha consistência de padrões

Ao refatorar, adote os padrões já consolidados no projeto:

- Entidades de domínio seguem o padrão da entidade `User` (construtor com invariantes, getters, sem `assign()`)
- Mappers seguem convenção de métodos única (`toDomain` / `toPersistence` — defina uma e aplique em todos)
- Validators de domínio ficam em `src/domain/services/`
- Use Cases ficam em `src/applications/usecases/<modulo>/`
- Enums de domínio ficam em `src/domain/enums/`
- Testes ficam em `tests/`, nunca dentro de `src/`

### Preserve a interface pública sempre que possível

Ao refatorar implementações internas, mantenha as assinaturas públicas inalteradas. Se for necessário mudar uma assinatura (ex: tipo de `id`), trate como uma mudança planejada e atualize todos os pontos de uso no mesmo commit.

---

## Critério de Conclusão de uma Refatoração

Uma tarefa de refatoração está concluída quando:

1. O código compilar sem erros TypeScript (`strict: true`)
2. Todos os testes existentes passarem
3. As regras de lint não apresentarem erros (`npm run lint:fix`)
4. A camada refatorada não violar nenhuma regra de dependência definida em `copilot-instruction.md`
5. O comportamento externo da API permanecer idêntico ao anterior

---

## Referências

- Regras de arquitetura: `.copilot/copilot-instruction.md`
- Regras de domínio: `.copilot/rules/domain-instruction.md`
- Regras de use cases: `.copilot/rules/usecase-instruction.md`
- Regras de controllers: `.copilot/rules/controller-instruction.md`
- Regras de testes: `.copilot/rules/testing-instruction.md`
- Backlog de tarefas: `docs/tasks/refactor.md`
