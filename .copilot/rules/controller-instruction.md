---
applyTo: "src/modules/**/*.controller.ts"
---

# Regras para Controllers

Controllers pertencem à camada de **Interface / Presentation** e são responsáveis exclusivamente por receber requisições HTTP, delegar ao service de orquestração e retornar a resposta.

## Responsabilidade

O controller **não deve conter lógica de negócio**. Sua única responsabilidade é:

1. Receber a requisição e extrair os dados necessários (body, params, query, user)
2. Chamar o service correspondente do módulo
3. Retornar a resposta formatada via DTO

## Estrutura esperada

```typescript
@Controller('recurso')
export class RecursoController {
  constructor(private readonly recursoService: RecursoService) {}

  @Post()
  async create(
    @Body() body: RecursoCsDto,
    @ActiveUserId() userId: string,
  ): Promise<RecursoScDto> {
    return this.recursoService.create({ data: body, userId });
  }
}
```

## Decorators obrigatórios

- Use `@ApiBearerAuth()` em todos os controllers que exigem autenticação
- Use `@IsPublic()` apenas em rotas que não exigem token (ex: login, signup)
- Use `@ApiTags('nome-do-modulo')` para organização no Swagger
- Prefira `@ActiveUserId()` para extrair o ID do usuário autenticado

## DTOs

- Toda entrada de dados deve usar um DTO (`*-cs.dto.ts` — Client to Server)
- Toda saída de dados deve usar um DTO (`*-sc.dto.ts` — Server to Client)
- DTOs ficam em `src/modules/<modulo>/dtos/`
- Use `class-validator` para validações de formato nos DTOs de entrada

## Evite

- Lógica condicional de negócio dentro do controller
- Acesso direto a repositórios ou entidades de domínio
- Transformações de dados além do mínimo necessário para montar o DTO
