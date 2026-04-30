---
name: nestjs-best-practices
description: >
  Activate when working with NestJS code: creating modules, controllers,
  services, use cases, guards, interceptors, pipes, decorators, DTOs,
  repositories, or any backend feature in this project.
  Also activate for refactoring, code review, or architectural decisions
  involving the NestJS stack.
reference: https://docs.nestjs.com/
---

# SKILL: nestjs-best-practices

## When to Activate

Activate this skill when the task involves **any** of the following:

- Creating or modifying a NestJS **module, controller, service, or use case**
- Implementing **guards, interceptors, pipes, or decorators**
- Working with **DTOs, validation, or exception filters**
- Integrating an **ORM** (Prisma, TypeORM, MikroORM, Mongoose)
- Reviewing or refactoring **backend code** in this project
- Making **architectural decisions** at the layer level

---

## Project Architecture at a Glance

This project follows **Clean Architecture** with a clear 4-layer separation:

```
Controller → Service → UseCase → Repository → Database
```

| Layer | Directory | Responsibility |
|---|---|---|
| Interface | `src/modules/` | HTTP, DTOs, routing |
| Application | `src/application/` | Business logic, use cases, validators |
| Infrastructure | `src/infrastructure/` | ORM, DB config, persistence |
| Shared | `src/shared/` | Guards, pipes, interceptors, decorators |

---

## Reasoning Protocol

Before generating **any** code, you MUST evaluate:

1. **Which layer** does this belong to? (Interface / Application / Infrastructure / Shared)
2. **What is the single responsibility** of this component?
3. **Does this depend on a framework?** If yes → not in Application layer
4. **Is there an existing abstraction** to reuse or extend?
5. **What is the transport?** (REST / GraphQL / gRPC / Message Broker)

Only after this evaluation, proceed with implementation.

---

## Non-Negotiable Rules

- Controllers must be **thin** — no business logic, only delegation
- Use Cases must be **framework-agnostic** — no NestJS decorators
- Never bypass the Use Case layer, even for "simple" operations
- Business validation lives in `application/validator/`, not in DTOs
- ORM details must never leak into the Application layer

---

## Reference

For detailed patterns, examples, and anti-patterns, see:
→ [`best-practices.md`](./best-practices.md)