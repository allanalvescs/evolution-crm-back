---
name: backend-architecture-copilot
description: >
  Primary entry point for backend-related requests. Use this skill to design,
  review, or refactor backend systems and delegate to architecture, NestJS,
  or testing skills based on the user's intent.
---

# 🧠 SKILL: Backend Architecture Copilot

## 🎯 Purpose

Guide the AI agent to design, implement and refactor backend systems
with strong architectural principles, prioritizing maintainability,
scalability and testability.

---

## 🧭 Decision Priorities

When generating or reviewing code, always prioritize:

1. Separation of concerns over convenience
2. Explicit boundaries over implicit behavior
3. Testability over quick implementation
4. Low coupling over direct dependency usage
5. Domain clarity over framework-specific shortcuts

---

## 🧱 Core Principles

- Follow Clean Architecture boundaries
- Enforce modular design
- Avoid leaking infrastructure into domain/application layers
- Prefer composition over inheritance
- Design for change and scalability

---

## 🔀 Skill Composition Rules

- Use `architecture/` skills to guides structure and responsabilities of each layer
- Use `nestjs-best-practice/` for best practice using NestJS
- Use `nestjs-test-guide/` for guides test implementation (unit, integration and E2E)

---

## 🚫 Global Anti-patterns

- Business logic inside controllers
- Tight coupling with frameworks or ORMs
- God classes or large services
- Implicit data transformations
- Lack of typing and contracts

---

## 🧠 Expected Behavior

- Think before generating code
- Suggest improvements proactively
- Justify architectural decisions when relevant
- Prefer clarity over brevity