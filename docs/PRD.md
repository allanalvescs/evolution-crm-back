# Evolution-CRM

## Visão Geral

Aplicação back-end **multi-tenant** para empresas SaaS gerenciarem seus clientes, planos e cupons de desconto. Cada empresa possui seus dados completamente isolados — nenhuma empresa acessa dados de outra.

---

## Modelo de Permissões

O sistema possui três roles para usuários internos de uma empresa:

| Módulo / Ação | ADMIN | SUPERVISOR | OPERATOR |
|---|:---:|:---:|:---:|
| Gerenciar usuários internos (criar, editar, remover) | ✅ | ❌ | ❌ |
| Cadastrar Clientes | ✅ | ❌ | ✅ |
| Editar Clientes | ✅ | ❌ | ✅ (somente os que cadastrou) |
| Remover Clientes | ✅ | ❌ | ❌ |
| Visualizar Clientes | ✅ | ✅ | ✅ |
| Cadastrar Planos | ✅ | ❌ | ❌ |
| Editar Planos | ✅ | ❌ | ❌ |
| Remover Planos | ✅ | ❌ | ❌ |
| Visualizar Planos | ✅ | ✅ | ✅ |
| Cadastrar Cupons | ✅ | ❌ | ✅ |
| Editar Cupons | ✅ | ❌ | ✅ (somente os que cadastrou) |
| Remover Cupons | ✅ | ❌ | ❌ |
| Visualizar Cupons | ✅ | ✅ | ✅ |
| Criar Subscriptions | ✅ | ❌ | ✅ |
| Cancelar Subscriptions | ✅ | ❌ | ✅ (somente as que criou) |
| Visualizar Subscriptions | ✅ | ✅ | ✅ |

> O primeiro usuário criado no cadastro da empresa recebe automaticamente a role **ADMIN**.
>
> **SUPERVISOR** tem acesso de leitura a todos os dados, mas não realiza nenhuma ação de escrita — seu papel é de acompanhamento e supervisão.
>
> **OPERATOR** pode cadastrar e editar registros, mas só pode editar aqueles que ele mesmo cadastrou.

---

## Funcionalidades do Sistema

### 1. Cadastro da Empresa

O cadastro é realizado em **duas etapas independentes e sequenciais**:

**Etapa 1 — Usuário (Dono do SaaS)**
- Dados: Nome *(obrigatório)*, Sobrenome *(obrigatório)*, Email *(obrigatório)*, Telefone *(opcional)*, Senha *(obrigatória)*
- Email deve ser único no sistema
- O usuário criado recebe role **ADMIN** automaticamente

**Etapa 2 — Empresa**
- Dados: Nome fantasia *(obrigatório)*, Razão Social *(obrigatório)*, CNPJ *(obrigatório)*, Telefone *(opcional)*
- CNPJ deve ser válido e único no sistema
- A empresa fica vinculada ao usuário da Etapa 1
- Somente o usuário autenticado pode registrar sua própria empresa

---

### 2. Autenticação e Autorização

- Login realizado com **Email** e **Senha**
- Credenciais inválidas retornam erro genérico (sem indicar qual campo está errado)
- Sessões são controladas por **token JWT** com validade de **7 dias**
- Não há refresh token na versão atual
- Todas as funcionalidades do sistema (exceto cadastro e login) exigem autenticação

---

### 3. Clientes

Clientes pertencem à empresa do usuário autenticado. Ações disponíveis: **Cadastro, Edição, Remoção e Listagem**.

**Dados do cliente:**
- Nome *(obrigatório)*
- Nome da empresa do cliente *(opcional)*
- Email do responsável *(obrigatório)*
- Tipo: **PF** (Pessoa Física) ou **PJ** (Pessoa Jurídica) *(obrigatório)*
- CPF — somente se `tipo = PF` *(obrigatório)*
- CNPJ — somente se `tipo = PJ` *(obrigatório)*
- Telefone *(opcional)*
- Endereço *(obrigatório)*:
  - CEP, Rua, Bairro, Número *(obrigatórios)*
  - Complemento *(opcional)*
  - Cidade, Estado (UF) *(obrigatórios)*

**Regras de negócio:**
- CPF ou CNPJ deve ser único **dentro da empresa** (dois clientes da mesma empresa não podem ter o mesmo documento)
- A remoção de um cliente é permanente (**hard delete**) e remove em cascata todas as suas subscriptions

---

### 4. Planos

Planos são criados pela empresa e oferecidos aos seus clientes. Ações disponíveis: **Cadastro, Edição, Remoção e Listagem**.

**Dados do plano:**
- Nome *(obrigatório)*
- Descrição *(opcional)*
- Valor em centavos — inteiro positivo, ex: `9900` = R$ 99,00 *(obrigatório)*
- Status: **Ativo** ou **Inativo** *(obrigatório)*
- Recorrência: **Mensal**, **Trimestral** ou **Anual** *(obrigatório)*

**Regras de negócio:**
- Planos pertencem à empresa e não são compartilhados entre empresas
- A recorrência é informativa — não gera cobranças automáticas
- Um plano só pode ser removido se **não possuir subscriptions ativas**
- Inativar um plano **não cancela** subscriptions existentes; apenas impede novas associações

---

### 5. Subscriptions (Assinaturas)

Entidade que representa a associação de um cliente a um plano, com controle de período. Um cliente pode ter múltiplas subscriptions (planos diferentes ou períodos distintos do mesmo plano). Ações disponíveis: **Criação, Cancelamento e Listagem**.

**Dados da subscription:**
- Cliente *(obrigatório)*
- Plano *(obrigatório)*
- Data de início *(obrigatória)*
- Data de fim *(opcional)* — ausência indica subscription contínua
- Cupom *(opcional)* — aplicado somente no momento da criação
- Valor final em centavos *(obrigatório)* — valor real cobrado do cliente; calculado no momento da criação com base no valor do plano, aplicando o desconto do cupom se houver

**Regras de negócio:**
- Cliente e plano devem pertencer à mesma empresa
- O cupom, se informado, deve estar vinculado ao plano da subscription
- O cupom só pode ser aplicado no **momento de criação** da subscription; não pode ser alterado depois
- Ao aplicar um cupom, a quantidade disponível dele é decrementada em 1
- Se a cota do cupom estiver esgotada, a subscription é recusada
- Cancelar uma subscription **não restitui** a cota do cupom utilizado
- A remoção é permanente (**hard delete**)

---

### 6. Cupons

Cupons de desconto criados pela empresa para uso em planos específicos. Ações disponíveis: **Cadastro, Edição, Remoção e Listagem**.

**Dados do cupom:**
- Nome descritivo *(obrigatório)* — não é um código digitável; serve apenas para identificação interna
- Plano associado *(obrigatório)* — o cupom é válido somente para esse plano
- Percentual de desconto *(obrigatório)* — inteiro de 1 a 100
- Quantidade disponível *(obrigatório)* — inteiro positivo; define a cota máxima de usos

**Regras de negócio:**
- Cupons pertencem à empresa e não são compartilhados entre empresas
- Cada cupom é válido **apenas para o plano ao qual está vinculado**
- Não há data de validade; a única restrição de uso é a **cota máxima**
- Quando a quantidade disponível chegar a 0, o cupom não pode mais ser utilizado
- Editar a quantidade disponível não afeta usos já registrados
- Um cupom só pode ser removido se **não estiver associado a nenhuma subscription**

