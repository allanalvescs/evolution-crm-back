---
name: architecture
description: >
  Activate when making any structural or cross-layer decision in this project:
  creating a new feature, deciding where a responsibility belongs, reviewing
  architectural consistency, or resolving layer boundary questions.
  Also activate when any file is being created under modules/, application/,
  infrastructure/, shared/, or domain/.
---

# SKILL: Architecture

## When to Activate

Activate this skill when the task involves:

- Creating or modifying **any file** in `src/`
- Deciding **which layer** a responsibility belongs to
- Reviewing **cross-layer dependencies**
- Onboarding a **new feature** end-to-end
- Identifying **architectural violations** in existing code

---

## Architecture Overview

This project applies **Clean Architecture** with **Domain-Driven Design (DDD)** principles,
organized into 4 strict layers with a single allowed dependency direction:

```
┌─────────────────────────────────────────┐
│         Interface Layer                 │  ← HTTP, DTOs, routing
│         src/modules/                    │
├─────────────────────────────────────────┤
│         Application Layer              │  ← Use cases, validators
│         src/application/               │
├─────────────────────────────────────────┤
│         Domain Layer                   │  ← Entities, business rules
│         src/domain/                    │
├─────────────────────────────────────────┤
│         Infrastructure Layer           │  ← ORM, DB, external services
│         src/infrastructure/            │
└─────────────────────────────────────────┘
         src/shared/                        ← Cross-cutting concerns
```

### Dependency Rule (non-negotiable)

```
Interface → Application → Domain ← Infrastructure
```

- Outer layers depend on inner layers — **never the reverse**
- Domain layer has **zero external dependencies**
- Infrastructure depends on Domain interfaces — **not the other way around**

---

## Layer Routing

When working on a specific layer, consult the corresponding reference:

| Task | Consult |
|---|---|
| Controller, DTO, routing, HTTP concerns | [`layers/controller.md`](./layers/controller.md) |
| Service orchestration, module wiring | [`layers/service.md`](./layers/service.md) |
| Business logic, use case, validation | [`layers/usecase.md`](./layers/usecase.md) |
| Entity, value object, domain rule | [`layers/domain.md`](./layers/domain.md) |

---

## Decision Protocol

Before writing any code or suggesting any structure, answer:

1. **What is the single responsibility of this component?**
2. **Which layer owns this responsibility?** (use the table above)
3. **What does this component depend on?** Does it violate the dependency rule?
4. **Is there an existing abstraction** I should extend instead of creating new?
5. **What changes if this component is replaced?** (coupling check)

---

## Core Principles

| Principle | Application in this project |
|---|---|
| **Single Responsibility** | One class = one reason to change |
| **Dependency Inversion** | Use cases depend on repository *interfaces*, not implementations |
| **Open/Closed** | Extend behavior via new use cases, not by modifying existing ones |
| **Separation of Concerns** | HTTP logic never mixes with business logic |
| **Framework Agnosticism** | Domain and Application layers have no NestJS imports |

---

## Non-Negotiable Rules

- **Never** skip the Use Case layer, even for "simple" operations
- **Never** import Infrastructure classes directly in Application or Domain
- **Never** place business logic in Controllers or Services
- **Never** let ORM entities reach the Interface layer directly — use DTOs
- **Always** depend on interfaces (abstractions), not concrete implementations