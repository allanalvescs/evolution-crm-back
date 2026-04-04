# Fase 01 — Domain Layer: Resumo Estruturado

> **Projeto:** Evolution CRM — Back-end
> **Camada:** Domain (Domínio)
> **Padrão:** Domain-Driven Design (DDD) com arquitetura limpa

---

## 1. Entidades Criadas

### 1.1 `User`
**Arquivo:** `src/domain/entities/user/user.ts`

| Propriedade    | Tipo                        | Obrigatório | Observação                              |
|----------------|-----------------------------|-------------|-----------------------------------------|
| `id`           | `string`                    | ✅ Sim       | —                                       |
| `name`         | `string`                    | ✅ Sim       | —                                       |
| `surname`      | `string \| null`            | ❌ Não       | —                                       |
| `email`        | `EmailValueObject`          | ✅ Sim       | Validado por VO                         |
| `phone`        | `PhoneValueObject \| null`  | ❌ Não       | Validado por VO se fornecido            |
| `password`     | `string`                    | ✅ Sim       | Hash deve ser aplicado antes da criação |
| `role`         | `EUserRole`                 | ✅ Sim       | `ADMIN`, `SUPERVISOR` ou `OPERATOR`     |
| `dtCreatedAt`  | `Date`                      | Auto         | Setado automaticamente na criação       |
| `dtUpdatedAt`  | `Date \| null`              | Auto         | `null` na criação                       |
| `dtLastLoginAt`| `Date \| null`              | Auto         | `null` na criação                       |

---

### 1.2 `Client`
**Arquivo:** `src/domain/entities/client/client.ts`

| Propriedade    | Tipo                        | Obrigatório      | Observação                               |
|----------------|-----------------------------|------------------|------------------------------------------|
| `id`           | `string`                    | ✅ Sim            | —                                        |
| `name`         | `string`                    | ✅ Sim            | —                                        |
| `companyName`  | `string \| null`            | ❌ Não            | Nome fantasia do cliente PJ              |
| `email`        | `EmailValueObject`          | ✅ Sim            | Validado por VO                          |
| `type`         | `EClientType`               | ✅ Sim            | `PF` ou `PJ`                             |
| `cpf`          | `CpfValueObject \| null`    | Condicional       | Obrigatório se `type === PF`             |
| `cnpj`         | `CnpjValueObject \| null`   | Condicional       | Obrigatório se `type === PJ`             |
| `phone`        | `PhoneValueObject \| null`  | ❌ Não            | Validado por VO se fornecido             |
| `address`      | `AddressValueObject`        | ✅ Sim            | Validado por VO                          |
| `companyId`    | `string`                    | ✅ Sim            | Referência à empresa dona do cliente     |
| `userId`       | `string`                    | ✅ Sim            | Referência ao usuário responsável        |

---

### 1.3 `Company`
**Arquivo:** `src/domain/entities/company/company.ts`

| Propriedade    | Tipo                       | Obrigatório | Observação                         |
|----------------|----------------------------|-------------|------------------------------------|
| `id`           | `string`                   | ✅ Sim       | —                                  |
| `tradeName`    | `string`                   | ✅ Sim       | Nome fantasia                      |
| `companyName`  | `string`                   | ✅ Sim       | Razão social                       |
| `cnpj`         | `CnpjValueObject`          | ✅ Sim       | Validado por VO                    |
| `phone`        | `PhoneValueObject \| null` | ❌ Não       | Validado por VO se fornecido       |
| `userId`       | `string`                   | ✅ Sim       | Usuário proprietário da empresa    |
| `dtCreatedAt`  | `Date`                     | Auto         | Setado automaticamente na criação  |
| `dtUpdatedAt`  | `Date \| null`             | Auto         | `null` na criação                  |

---

## 2. Value Objects

| Value Object        | Arquivo                                      | Campos validados                                         |
|---------------------|----------------------------------------------|----------------------------------------------------------|
| `EmailValueObject`  | `src/domain/value-objects/email/email.ts`    | Formato de e-mail via regex; trim + lowercase            |
| `PhoneValueObject`  | `src/domain/value-objects/phone/phone.ts`    | 10 ou 11 dígitos; celular (9 na 3ª pos.) vs. fixo        |
| `CpfValueObject`    | `src/domain/value-objects/cpf/cpf.ts`        | 11 dígitos; dígitos verificadores; não pode ser uniforme |
| `CnpjValueObject`   | `src/domain/value-objects/cnpj/cnpj.ts`      | 14 dígitos; não pode ser uniforme                        |
| `AddressValueObject`| `src/domain/value-objects/address/address.ts`| CEP (8 dígitos), UF válida, campos obrigatórios          |

---

## 3. Regras de Negócio

### 3.1 Regras do `User`
- **Role obrigatória e validada:** deve ser `ADMIN`, `SUPERVISOR` ou `OPERATOR`.
- **E-mail em formato válido** e normalizado (lowercase + trim).
- **Telefone opcional**, mas quando fornecido segue validação de formato brasileiro.
- **Senha não é validada pelo domínio** — espera receber já o hash.
- Datas de auditoria (`dtCreatedAt`, `dtUpdatedAt`, `dtLastLoginAt`) são controladas internamente.

### 3.2 Regras do `Client`
- **Discriminador PF/PJ obrigatório:** todo cliente deve declarar seu tipo.
- **CPF exclusivo de PF:** cliente PJ **não pode** ter CPF; cliente PF **não pode** ter CNPJ.
- **CPF é obrigatório para PF**; **CNPJ é obrigatório para PJ**.
- **Endereço sempre obrigatório** para qualquer tipo de cliente.
- **Isolamento por empresa:** `companyId` garante que clientes pertencem a uma empresa específica.
- **Rastreabilidade:** `userId` registra o usuário que cadastrou o cliente.

### 3.3 Regras do `Company`
- **CNPJ obrigatório** e validado pelo `CnpjValueObject`.
- **Nome fantasia e razão social** são obrigatórios e distintos.
- **Uma empresa está vinculada a um usuário** via `userId`.

### 3.4 Regras dos Value Objects
| Value Object   | Regras                                                                                        |
|----------------|-----------------------------------------------------------------------------------------------|
| `Email`        | Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; obrigatório                                            |
| `Phone`        | Apenas dígitos; 10 dígitos = fixo; 11 dígitos = celular (3ª posição = `9`)                   |
| `CPF`          | 11 dígitos; não pode ser sequência uniforme; valida **ambos** os dígitos verificadores        |
| `CNPJ`         | 14 dígitos; não pode ser sequência uniforme; **não valida** dígitos verificadores             |
| `Address`      | CEP: `/^\d{8}$/`; Estado: lista de 27 UFs brasileiras válidas; demais campos não vazios       |

---

## 4. Decisões Arquiteturais

### 4.1 Factory Method com construtor privado
Todas as entidades e value objects expõem `static create(props)` como único ponto de entrada. O construtor é privado (`private constructor`), impedindo instanciação direta e garantindo que toda criação passe pelas validações do domínio.

### 4.2 Value Objects como tipos ricos
Primitivos sensíveis (e-mail, telefone, CPF, CNPJ, endereço) são encapsulados em Value Objects imutáveis. Isso move a validação para o domínio, elimina duplicações e torna inválidos os estados impossíveis de representar.

### 4.3 Repositórios como `abstract class`
Os contratos de repositório são definidos como `abstract class` em vez de `interface`. Isso permite que o framework de injeção de dependência (NestJS) os use como tokens de DI sem necessidade de decorators adicionais.

### 4.4 Contratos de serviço externos no domínio
`PasswordHasher` e `TokenGenerator` são abstrações definidas dentro do domínio, garantindo que a camada de domínio não dependa de implementações externas (bcrypt, JWT). As implementações ficam na camada de infraestrutura.

### 4.5 Referências por ID entre agregados
Entidades de agregados distintos se referenciam exclusivamente por ID (`companyId`, `userId`), não por referência direta. Isso mantém os limites dos agregados e evita acoplamento entre entidades.

### 4.6 Sem eventos de domínio
A fase atual não implementa eventos de domínio. Toda comunicação entre casos de uso ocorre de forma síncrona, por chamada direta.

### 4.7 Sem classes de erro customizadas
Validações lançam `Error` genérico com mensagens em português. Não existem classes de erro de domínio dedicadas (ex.: `DomainException`, `ValidationError`).

### 4.8 Sem barrel exports
Não há arquivos `index.ts` de reexportação. Cada importação aponta diretamente para o arquivo da entidade/VO.

---

## 5. Enums

| Enum          | Arquivo                                      | Valores                            |
|---------------|----------------------------------------------|------------------------------------|
| `EUserRole`   | `src/domain/enums/user-role.enum.ts`         | `ADMIN`, `SUPERVISOR`, `OPERATOR`  |
| `EClientType` | `src/domain/enums/client-type.enum.ts`       | `PF`, `PJ`                         |
| `EStatus`     | `src/domain/enums/status.enum.ts`            | `ACTIVE`, `INACTIVE`               |

> ⚠️ `EStatus` está definido mas **não é usado** em nenhuma entidade da fase atual.

---

## 6. Contratos de Repositório

| Repositório         | Arquivo                                              | Métodos disponíveis                                                   |
|---------------------|------------------------------------------------------|-----------------------------------------------------------------------|
| `UserRepository`    | `src/domain/repositories/user.repository.ts`         | `create`, `findByEmail`, `findById`                                   |
| `ClientRepository`  | `src/domain/repositories/client.repository.ts`       | `create`, `findById`, `findByCpfAndCompanyId`, `findByCnpjAndCompanyId` |
| `CompanyRepository` | `src/domain/repositories/company.repository.ts`      | `create`, `findByCnpj`, `findByUserId`                                |

---

## 7. Contratos de Serviço (Portas)

| Contrato         | Arquivo                                                  | Métodos                        |
|------------------|----------------------------------------------------------|--------------------------------|
| `PasswordHasher` | `src/domain/contracts/password-hasher.interface.ts`      | `hash(password)`, `compare(password, hash)` |
| `TokenGenerator` | `src/domain/contracts/token-generator.interface.ts`      | `generate(payload)`            |

**Payload do Token:**
```ts
type TokenPayload = {
  sub: string;    // ID do usuário
  email: string;
  role: string;
};
```

---

## 8. Pontos de Atenção

| # | Ponto                                     | Descrição                                                                                                                                              |
|---|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | **CNPJ sem validação de dígitos verificadores** | `CnpjValueObject` valida apenas tamanho e sequência uniforme. O CNPJ pode ser numericamente inválido sem ser rejeitado pelo domínio.               |
| 2 | **Erro genérico (`Error`)**               | Todas as violações de regra lançam `Error` nativo. Sem classes de domínio específicas, fica difícil distinguir erros de domínio de erros de runtime na camada de aplicação. |
| 3 | **`EStatus` sem uso**                     | O enum `EStatus` existe mas não é aplicado em nenhuma entidade. Pode indicar funcionalidade planejada (ativação/desativação de usuários ou clientes) não implementada. |
| 4 | **Métodos `update`/`delete` comentados em `UserRepository`** | Indica que operações de atualização e exclusão de usuários não foram implementadas na fase atual, podendo ser lacunas para fases futuras.          |
| 5 | **`User` sem construtor privado**         | Diferente de `Client` e `Company`, a entidade `User` não usa `private constructor`, o que permite instanciação direta contornando as validações do `create()`. |
| 6 | **Sem barrel exports**                    | A ausência de `index.ts` pode tornar as importações mais verbosas conforme o projeto crescer.                                                          |
| 7 | **Sem eventos de domínio**               | Ações como "usuário criado" ou "cliente cadastrado" não emitem eventos. Se houver necessidade de side-effects desacoplados (notificações, auditoria), será necessário refatorar. |
| 8 | **Formatação de telefone no VO**         | O `PhoneValueObject` formata o número internamente (ex.: `(11) 99999-9999`). Isso pode causar inconsistência se a camada de persistência armazenar o valor bruto vs. formatado. |

---

## 9. Estatísticas da Fase

| Categoria              | Quantidade |
|------------------------|------------|
| Entidades              | 3          |
| Value Objects          | 5          |
| Repositórios (contrato)| 3          |
| Serviços (contrato)    | 2          |
| Enums                  | 3          |
| Eventos de domínio     | 0          |
| Serviços de domínio    | 0          |
| Classes de erro custom | 0          |
| Total de arquivos `.ts`| 16         |
