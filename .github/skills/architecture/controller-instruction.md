---
applyTo: "src/modules/**/*.controller.ts"
---

# Controllers Rules

Controllers belong to the **Interface / Presentation** layer and are solely responsible for receiving HTTP requests, delegating to the orchestration service, and returning the response.

## Responsabilities

The controller **should not contain business logic**. Its sole responsibility is:

1. Receive the request and extract the necessary data (body, params, query, user)
2. Call the corresponding service of the module
3. Return the formatted response via DTO

## Expected structure

```typescript
@Controller('resource')
export class resourceController {
  constructor(private readonly resourceService: resourceService) {}

  @Post()
  async create(
    @Body() body: resourceCsDto,
    @ActiveUserId() userId: string,
  ): Promise<resourceScDto> {
    return this.resourceService.create({ data: body, userId });
  }
}
```

## Essential decorators

- Use `@ApiBearerAuth()` in all controllers that require authentication.
- Use `@IsPublic()` only in routes that do not require a token (e.g., login, signup).
- Use `@ApiTags('module-name')` for organization in Swagger.
- Prefer `@ActiveUserId()` to extract the authenticated user's ID.

## DTOs (Data-Transfer-Object)

- All data input must use a DTO (`*-cs.dto.ts` — Client to Server)
- All data output must use a DTO (`*-sc.dto.ts` — Server to Client)
- DTOs are located in `src/modules/<module>/dtos/`
- Use `class-validator` for format validations on input DTOs

## Avoid

- Conditional business logic within the controller
- Direct access to repositories or domain entities
- Data transformations beyond the minimum required to build the DTO
