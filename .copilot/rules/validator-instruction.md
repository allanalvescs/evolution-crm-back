---
applyTo: "src/applications/validator/**/*.ts"
---

# Regras para Validators

Validators pertencem à camada de **Application** e têm como único objetivo criar uma camada de validação reutilizável para uso em fluxos (Use Cases e Services). São tipicamente validações **assíncronas** que consultam repositórios ou serviços externos, podendo ser compartilhados entre múltiplos Use Cases.

## Responsabilidade

Um Validator **não orquestra fluxo, não persiste dados e não transforma entidades**. Ele:

1. Recebe um dado primitivo ou identificador
2. Consulta um repositório (ou serviço de domínio) de forma assíncrona
3. Lança uma exceção HTTP semântica se a validação falhar
4. Retorna `void` — ou a entidade consultada, quando o dado é necessário no fluxo seguinte

## Localização e Nomenclatura

```
src/applications/validator/
  {dominio}/
    {dominio}.validator.ts     ← único arquivo por domínio
```

Exemplos:
- `src/applications/validator/user/user.validator.ts` → `UserValidator`
- `src/applications/validator/company/company.validator.ts` → `CompanyValidator`
- `src/applications/validator/auth/auth.validator.ts` → `AuthValidator`

## Estrutura esperada

```typescript
import { ConflictException, Injectable } from "@nestjs/common";
import { RecursoRepository } from "src/domain/repositories/recurso.repository";

@Injectable()
export class RecursoValidator {
  constructor(private readonly recursoRepository: RecursoRepository) {}

  // Validação de unicidade → retorna void
  async existByIdentifier(identifier: string): Promise<void> {
    const recurso = await this.recursoRepository.findByIdentifier(identifier);
    if (recurso) {
      throw new ConflictException("Já existe um recurso com esse identificador");
    }
  }

  // Validação com retorno de dado → retorna a entidade
  async validateAndGet(id: string): Promise<RecursoDomain> {
    const recurso = await this.recursoRepository.findById(id);
    if (!recurso) {
      throw new NotFoundException("Recurso não encontrado");
    }
    return recurso;
  }
}
```

## Tipos de retorno

| Caso de uso | Retorno |
|---|---|
| Verificar existência / unicidade | `Promise<void>` |
| Validar e retornar dado para uso no fluxo | `Promise<EntidadeDomain>` |

> Nunca retorne DTOs, objetos de ORM ou tipos de infraestrutura.

## Exceções permitidas

Use exceções do NestJS com semântica HTTP correta:

| Situação | Exceção |
|---|---|
| Recurso já existe (conflito de unicidade) | `ConflictException` |
| Credenciais inválidas | `UnauthorizedException` |
| Recurso não encontrado | `NotFoundException` |
| Regra de negócio genérica | `HttpException` com `HttpStatus` explícito |

Mensagens de erro devem ser **descritivas em português** e orientadas ao usuário final.

## Registro no ValidatorModule

Todo Validator **deve** ser declarado em `src/applications/validator/validator.module.ts`:

```typescript
@Module({
  providers: [RecursoValidator],
  exports: [RecursoValidator],
})
export class ValidatorModule {}
```

- Declare em `providers` para que o NestJS gerencie a instância
- Declare em `exports` para que módulos externos (Use Cases) possam injetá-lo

## Regras

- Todo Validator deve ser uma classe `@Injectable()`
- Nomes de métodos devem ser descritivos e orientados à ação: `existByEmail`, `existByCnpj`, `validate`, `validateAndGet`
- Dependa apenas de **interfaces de domínio** (`XRepository`, contratos de `src/domain/contracts/`)
- Um Validator por domínio — múltiplos métodos de validação dentro da mesma classe
- Métodos devem ser **assíncronos** (`async`) — mesmo que a operação futura seja síncrona
- Validators são **reutilizáveis**: devem poder ser injetados em qualquer Use Case que precise daquela validação

## Evite

- Lógica de orquestração ou persistência dentro do Validator
- Importar entidades ORM, módulos de infraestrutura ou serviços concretos diretamente (use contracts/interfaces)
- Retornar DTOs de resposta HTTP — isso é responsabilidade do controller
- Criar um Validator por Use Case — agrupe validações de mesmo domínio
- Duplicar validações já existentes em outro Validator do mesmo domínio