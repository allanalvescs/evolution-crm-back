# Estratégia de Branches

Branches devem ser criadas sempre a partir da branch `develop`. Nunca crie branches diretamente de `main`.

Padrões de nomenclatura obrigatórios:

```
feature/<nome-da-funcionalidade>    # nova funcionalidade
fix/<descricao-do-bug>              # correção de bug
refactor/<contexto-da-refatoracao>  # refatoração sem mudança de comportamento
```

> Use **kebab-case** e nomes objetivos: `feature/auth-jwt`, `fix/user-email-validation`, `refactor/order-aggregate`.

---

# Fluxo de Implementação

Siga rigorosamente esta sequência a cada nova tarefa:

### 1. Posicionar na branch base e atualizar

```bash
git checkout develop
git pull origin develop
```

> **Sempre** atualize o `develop` local antes de criar uma branch para evitar conflitos desnecessários.

### 2. Criar a branch de trabalho

```bash
git checkout -b feature/<nome-da-funcionalidade>
```

### 3. Implementar

Implemente a funcionalidade respeitando as diretrizes de arquitetura em `.copilot/copilot-instruction.md`.

### 4. Revisar as mudanças antes de commitar

```bash
git status         # lista arquivos modificados, adicionados e não rastreados
git diff           # exibe as mudanças linha a linha ainda não staged
```

Analise cada mudança. Só avance para o staging após confirmar que as alterações são corretas e coesas.

### 5. Selecionar os arquivos para staging

Adicione apenas os arquivos relacionados ao contexto do commit:

```bash
git add <arquivo>              # adiciona arquivo específico (preferido)
git add src/domain/ tests/     # adiciona por diretório
git add -p                     # modo interativo: revisa hunk a hunk
```

> Evite `git add .` — ele inclui arquivos não intencionais e dificulta a rastreabilidade.

### 6. Commitar

```bash
git commit -m "<type>(<scope>): <descrição curta>"
```

> Repita os passos 4, 5 e 6 para cada unidade lógica de mudança. Prefira múltiplos commits pequenos a um único commit grande.

---

# Commits

As mensagens de commit devem seguir **Conventional Commits**.

## Tipos permitidos

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade visível ao domínio ou API |
| `fix` | Correção de bug ou comportamento incorreto |
| `refactor` | Mudança interna sem alteração de comportamento externo |
| `test` | Adição ou correção de testes |
| `docs` | Atualização de documentação técnica |
| `chore` | Tarefas de manutenção (configs, deps, scripts) |

## Formato

```
<type>(<scope>): <descrição no imperativo, em português>
```

## Exemplos

```
feat(auth): adiciona autenticação JWT com refresh token
fix(user): corrige validação de email duplicado no cadastro
refactor(order): extrai regra de desconto para domain service
test(payment): adiciona testes unitários para PaymentUseCase
docs(client): atualiza documentação do módulo de clientes
chore(deps): atualiza mikro-orm para versão 6.x
```

## Regras

* Commits devem ser **atômicos** — uma única responsabilidade por commit
* Nunca combine `feat` + `fix` no mesmo commit
* A descrição deve estar no **imperativo** e ser **clara sem contexto adicional**
* Escopo (`scope`) deve refletir o módulo ou camada afetada: `auth`, `user`, `client`, `domain`, `infra`

---

# Sincronização com develop

Durante desenvolvimentos longos, mantenha a branch atualizada com `develop` para reduzir conflitos no PR:

```bash
git fetch origin
git rebase origin/develop
```

> Prefira `rebase` a `merge` para manter o histórico linear.

Em caso de conflitos durante o rebase:

```bash
# 1. Resolva os conflitos nos arquivos indicados
# 2. Marque como resolvidos
git add <arquivo-resolvido>
# 3. Continue o rebase
git rebase --continue
```

Para abortar e voltar ao estado anterior:

```bash
git rebase --abort
```

---

# Pull Requests

### 1. Validar antes do push

Todos os critérios abaixo devem ser atendidos antes de abrir o PR:

* Todos os testes passando
* Sem erros de lint
* Código respeitando as regras de arquitetura

```bash
npm run lint:fix && npm test
```

### 2. Publicar a branch no repositório remoto

Na primeira vez que fizer push da branch:

```bash
git push --set-upstream origin <nome-da-branch>
```

Pushes subsequentes:

```bash
git push
```

### 3. Abrir o Pull Request via MCP GitHub

Utilize a integração MCP com o GitHub para criar o Pull Request. O PR deve:

* Ter como **base** a branch `develop`
* Seguir o template definido em `.github/template/merge-request.md`
* Incluir no corpo do PR a documentação técnica gerada em `docs/issues/<nome-da-funcionalidade>/`

> Garanta que a documentação técnica em `docs/issues/<nome-da-funcionalidade>/` esteja criada e atualizada antes de abrir o PR.