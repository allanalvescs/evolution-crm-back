# Documentação Técnica — Módulo de Usuário

> Cobre os módulos `auth` e `user`, responsáveis por cadastro, autenticação e perfil do usuário interno de uma empresa.

---

## 1. Visão Geral

O módulo de usuário gerencia os **usuários internos** de cada empresa cadastrada no Evolution CRM. A plataforma é **multi-tenant**: cada empresa possui seus dados completamente isolados — nenhum usuário de uma empresa acessa dados de outra.

O primeiro usuário criado no cadastro da empresa recebe automaticamente a role **ADMIN** e é o responsável por gerenciar os demais usuários internos.

**Funcionalidades cobertas:**
- Cadastro do primeiro usuário da empresa (Signup)
- Autenticação via email e senha (Signin)
- Consulta do perfil do usuário autenticado (`/users/me`)

---

## 2. Regras de Negócio

### 2.1 Cadastro (Signup)

- O cadastro de usuário é a **Etapa 1** do fluxo de registro da empresa
- Campos obrigatórios: `nome`, `sobrenome`, `email`, `senha`
- Campo opcional: `telefone`
- O **email deve ser único** no sistema (não apenas dentro da empresa)
- O usuário criado recebe automaticamente a role `ADMIN`

### 2.2 Autenticação (Signin)

- Login realizado com **email** e **senha**
- Credenciais inválidas retornam erro genérico — **não indicam qual campo está incorreto** (segurança)
- Sessão controlada por **token JWT** com validade de **7 dias**
- Não há refresh token na versão atual

### 2.3 Modelo de Roles

| Role | Descrição |
|---|---|
| `ADMIN` | Acesso total — gerencia usuários, clientes, planos, cupons e subscriptions |
| `SUPERVISOR` | Acesso de leitura em todos os módulos; não realiza escritas |
| `OPERATOR` | Pode cadastrar e editar registros, mas só edita os que ele mesmo criou |

> O sistema atual não implementa verificação de permissões por role nos endpoints do módulo de usuário — o controle de acesso por role é aplicado nos módulos de negócio.

---

## 3. Modelos de Domínio

### 3.1 Entidade `User`

**Localização:** `src/domain/entities/user/user.ts`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|:---:|---|
| `id` | `string` (UUID) | ✅ | Identificador único |
| `name` | `string` | ✅ | Nome do usuário |
| `surname` | `string \| null` | ❌ | Sobrenome |
| `email` | `EmailValueObject` | ✅ | Email encapsulado com validação |
| `phone` | `PhoneValueObject \| null` | ❌ | Telefone encapsulado |
| `password` | `string` | ✅ | Senha já hasheada |
| `role` | `EUserRole` | ✅ | Role do usuário |
| `dtCreatedAt` | `Date` | ✅ | Data de criação |
| `dtUpdatedAt` | `Date \| null` | ❌ | Última atualização |
| `dtLastLoginAt` | `Date \| null` | ❌ | Último login |

**Métodos públicos:**

| Método | Retorno | Descrição |
|---|---|---|
| `getId()` | `string` | Retorna o id |
| `getName()` | `string` | Retorna o nome |
| `getSurname()` | `string \| null` | Retorna o sobrenome |
| `getEmail()` | `string` | Retorna o email como string |
| `getPassword()` | `string` | Retorna a senha hasheada |
| `getRole()` | `EUserRole` | Retorna a role |
| `getPhone()` | `string \| null` | Retorna o telefone como string |

**Invariantes do construtor:**
- `id`, `name`, `password` e `role` são obrigatórios — lança exceção se ausentes
- `role` deve ser um valor válido do enum `EUserRole`
- `email` é encapsulado em `EmailValueObject` (validação de formato)
- `phone` é encapsulado em `PhoneValueObject` quando informado

### 3.2 Enum `EUserRole`

**Localização:** `src/domain/enums/user-role.enum.ts`

```typescript
enum EUserRole {
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  OPERATOR = "OPERATOR",
}
```

### 3.3 Interface `UserRepository`

**Localização:** `src/domain/repositories/user.repository.ts`

```typescript
abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
```

---

## 4. Fluxos de Implementação

### 4.1 Signup

```
POST /auth/signup
  └── AuthController.signup()
        └── AuthService.signup()                        ← orquestração
              └── SignupUseCase.execute()                ← application
                    ├── UserValidator.existByEmail()     ← domain service
                    │     └── UserRepository.findByEmail()
                    ├── PasswordHasher.hash()            ← contract (infra: bcrypt)
                    ├── new User(uuid, name, hashedPw, ADMIN, ...)
                    └── UserRepository.create()
```

### 4.2 Signin

```
POST /auth/signin
  └── AuthController.signin()
        └── AuthService.signin()                        ← orquestração
              └── SigninUseCase.execute()                ← application
                    ├── AuthValidator.validate()         ← domain service
                    │     ├── UserRepository.findByEmail()
                    │     └── PasswordHasher.compare()   ← contract (infra: bcrypt)
                    └── TokenGenerator.generate()        ← contract (infra: jwt)
                          └── retorna { accessToken }
```

### 4.3 Perfil do usuário autenticado

```
GET /users/me
  └── UserController.me()                               ← extrai payload do JWT
        └── UserService.me(payload)                     ← orquestração
              └── UserRepository.findById(payload.id)
                    └── retorna UserMeScResponseDto
```

---

## 5. Use Cases

### 5.1 `SignupUseCase`

**Localização:** `src/applications/usecases/auth/signup/signup.usecase.ts`

| | Tipo |
|---|---|
| **Input** | `{ name, email, password, surname? }` |
| **Output** | `User` (entidade de domínio) |

**Fluxo interno:**
1. Verifica unicidade do email via `UserValidator.existByEmail()`
2. Gera hash da senha via `PasswordHasher.hash()`
3. Instancia `new User(uuid, name, hashedPassword, ADMIN, email, ...)`
4. Persiste via `UserRepository.create()`
5. Retorna a entidade `User`

**Dependências injetadas:** `UserRepository`, `UserValidator`, `PasswordHasher`

---

### 5.2 `SigninUseCase`

**Localização:** `src/applications/usecases/auth/signin/signin.usecase.ts`

| | Tipo |
|---|---|
| **Input** | `{ email, password }` |
| **Output** | `{ accessToken: string }` |

**Fluxo interno:**
1. Valida credenciais via `AuthValidator.validate({ email, password })`
   - Busca usuário por email
   - Compara senha com hash via `PasswordHasher.compare()`
   - Lança `UnauthorizedException` se inválido
2. Gera JWT via `TokenGenerator.generate({ sub, email, role })`
3. Retorna `{ accessToken }`

**Dependências injetadas:** `AuthValidator`, `TokenGenerator`

---

## 6. Infraestrutura

### 6.1 `UserEntity` (ORM)

**Localização:** `src/infrastructure/persistence/entities/user.entity.ts`
**Tabela:** `users` | **Extends:** `BaseEntity`

| Campo ORM | Tipo | Observação |
|---|---|---|
| `name` | `string` | required |
| `surname` | `string` | nullable |
| `email` | `string` | unique, required |
| `password` | `string` | required |
| `phone` | `string` | nullable |
| `role` | `EUserRole` | required |
| `tokenJwt` | `string` | nullable — não utilizado ativamente |
| `avatarUrl` | `string` | nullable |
| `dtLastLoginAt` | `timestamp with time zone` | nullable |

### 6.2 `UserMapper`

**Localização:** `src/infrastructure/persistence/mappers/user/user.mapper.ts`

| Método | Descrição |
|---|---|
| `toDomainEntity(entity: UserEntity): User` | Converte entidade ORM para entidade de domínio |
| `toOrmEntity(user: User): UserEntity` | Converte entidade de domínio para entidade ORM |

### 6.3 `MikroOrmUserRepository`

**Localização:** `src/infrastructure/persistence/repositories/users.repository.ts`
**Implements:** `UserRepository`

| Método | Comportamento |
|---|---|
| `create(user)` | Mapeia para ORM, persiste e executa flush |
| `findByEmail(email)` | Busca por email; retorna `null` se não encontrado |
| `findById(id)` | Busca por id (UUID string); retorna `null` se não encontrado |

---

## 7. Interface / Presentation

### 7.1 `AuthController`

**Localização:** `src/modules/auth/auth.controller.ts`
**Rota base:** `/auth`

| Método | Rota | Status | Auth | Input DTO | Output DTO |
|---|---|:---:|:---:|---|---|
| `POST` | `/auth/signup` | `201` | ❌ público | `SignupCsDto` | `SignupScResponseDto` |
| `POST` | `/auth/signin` | `200` | ❌ público | `SigninCsDto` | `SigninScResponseDto` |

### 7.2 `UserController`

**Localização:** `src/modules/user/user.controller.ts`
**Rota base:** `/users`

| Método | Rota | Status | Auth | Output DTO |
|---|---|:---:|:---:|---|
| `GET` | `/users/me` | `200` | ✅ JWT | `UserMeScResponseDto` |

### 7.3 DTOs

**Input (Client → Server):**

| DTO | Campos |
|---|---|
| `SignupCsDto` | `name`, `email`, `password` |
| `SigninCsDto` | `email`, `password` |

**Output (Server → Client):**

| DTO | Campos |
|---|---|
| `SignupScResponseDto` | `id`, `name`, `surname`, `email`, `role`, `avatarUrl`, `dtLastLoginAt`, `dtCreatedAt`, `dtUpdatedAt` |
| `SigninScResponseDto` | `accessToken` |
| `UserMeScResponseDto` | perfil do usuário autenticado |

---

## 8. Estratégia de Testes

| Componente | Tipo | Localização | O que testar |
|---|---|---|---|
| `User` (entity) | Unitário | `tests/unit/domain/user/` | Invariantes do construtor, getters, validação de role inválida |
| `SignupUseCase` | Unitário | `tests/unit/usecases/auth/` | Fluxo feliz, email duplicado, erro no hash |
| `SigninUseCase` | Unitário | `tests/unit/usecases/auth/` | Fluxo feliz, credenciais inválidas, geração de token |
| `AuthValidator` | Unitário | `tests/unit/domain/` | Usuário não encontrado, senha incorreta |
| `UserValidator` | Unitário | `tests/unit/domain/` | Email já cadastrado, email disponível |
| `AuthController` | Integração | `tests/integration/auth/` | `POST /auth/signup`, `POST /auth/signin` |
| `UserController` | Integração | `tests/integration/user/` | `GET /users/me` autenticado e sem token |

---

## 9. Débitos Técnicos Pendentes

> Itens em aberto do backlog `docs/tasks/refactor-user-module.md`.

| ID | Prioridade | Descrição |
|---|:---:|---|
| R-D6 | 🟡 | `UserValidator` lança `HttpException` (400) hardcoded — deveria ser `ConflictException` (409) |
| R-A4 | 🟡 | `AuthValidator.validate()` retorna `User` com senha — dado sensível exposto |
| R-A5 | 🟡 | `AuthValidator` usa `bcryptjs` diretamente — deveria usar o contract `PasswordHasher` |
| R-E4 | 🟡 | `UserValidator` ainda está em `src/applications/validator/` — deveria estar em `src/domain/services/` |
| R-M2 | 🟡 | `AuthService.signup()` ainda contém lógica de use case — deve apenas orquestrar `SignupUseCase` |
| R-M4 | 🟡 | `UserService.me()` recebe `id: number` no payload — deveria ser `string` (UUID) |
| R-M5 | 🟢 | Dois decorators com finalidades sobrepostas: `@ActiveUserId()` e `@ExtractPayload()` |
| R-M6 | 🟢 | `UserController` sem `@ApiTags()` — inconsistência na documentação Swagger |
| R-T2 | 🟡 | Casos de teste não seguem o padrão `should_<comportamento>_when_<condição>` |
| R-T3 | 🟢 | Falta `FakeUserRepository` reutilizável em `tests/fakes/` |
