---
name: architecture
description: >
  Use this skill for designing, structuring, or refactoring application
  architecture, including layer separation (controller, service, use case,
  domain), Clean Architecture, SOLID principles, and scalable backend design.
---

# 🏗️ Architecture Skill

## 🎯 Objective

Ensure that every architectural suggestion:

* Follows Clean Architecture principles
* Applies SOLID principles consistently
* Maintains clear separation of responsibilities
* Promotes low coupling and high cohesion
* Is scalable, testable, and modular

---

## 🧠 Role of this Skill

This skill acts as an **architecture orchestrator**, responsible for:

* Identifying the involved layer
* Delegating specific rules to specialized instruction files
* Ensuring consistency across layers
* Preventing responsibility violations

---

## 🧩 Reference Structure

```
.github/
 └──skills/
    └──architeture
       ├── controller-instruction.md
       ├── domain-instructure.md
       ├── service-instruction.md
       ├── usecase-instruction.md
       └── SKILL.md
```

---

## 🧭 Layer Decision Map

Use this guide to determine which instruction to load:

### 📌 Controller → `controller-instruction.md`

Use when there is:

* Request handling (HTTP, RPC, etc.)
* Input validation
* Delegation to application layers

Responsibility:

* Orchestrate request flow
* Must NOT contain business logic

---

### 📌 Service → `service-instruction.md`

Use when there is:

* Orchestration across multiple use cases
* Application-level logic (not pure domain logic)
* Transaction management
* Integration with infrastructure

Responsibility:

* Coordinate use case execution
* Avoid complex business rules

---

### 📌 Use Case → `usecase-instruction.md`

Use when there is:

* A specific business flow execution
* Cases like: CreateUser, ProcessPayment, etc.

Responsibility:

* Represent a system action
* Contain application-level business flow logic

---

### 📌 Domain → `domain-instructure.md`

Use when there is:

* Pure business rules
* Entities, Value Objects, and Aggregates
* System invariants

Responsibility:

* Be framework-independent
* Have no infrastructure dependencies

---

## 📏 Global Rules

* Controllers must not contain business logic
* Services must not directly depend on infrastructure details
* Use Cases must be framework-independent
* Domain must be completely pure
* Dependencies must always point inward (Dependency Rule)

---

## ❌ Anti-patterns

Always avoid:

* Controllers with business logic
* Services accessing the database directly without abstraction
* Use Cases depending on frameworks (e.g., NestJS)
* Domain layer using ORM, HTTP, or external libraries
* Classes with multiple responsibilities (God Objects)
* Duplicated logic across layers

---

## 🔗 Integration with Other Skills

* For NestJS-specific implementation:
  → use `nestjs-best-pratice/SKILL.md`

Clear separation:

| Skill               | Responsibility             |
| ------------------- | -------------------------- |
| architecture        | Structure and organization |
| nestjs-best-pratice | Framework implementation   |

---

## 🧠 Execution Strategy

When responding:

1. Identify the user’s intent
2. Determine the involved layer(s)
3. Load only the necessary instructions
4. Apply layer-specific rules
5. Ensure consistency with global rules
6. Suggest structural improvements when applicable

---

## 🧪 Quality Guidelines

The proposed solutions must:

* Be easily testable
* Be framework-independent whenever possible
* Minimize coupling between modules
* Maximize internal cohesion
* Facilitate evolution and maintenance

---
