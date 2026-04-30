# CLAUDE.md

## Contexto do Projeto
This project is a CRM (Customer Relationship Management) designed for companies to manage their customers and execute internal strategic operations.

### Core Features:

* Customer management
* Plan creation and management
* Coupon generation
* Customer dashboard by plan
* Internal strategic operations

----

## 🏗️ Tech Stack

### Backend

* NestJS (main framework)
* PostgreSQL (relational database)
* MikroORM (ORM)
* RabbitMQ (asynchronous messaging)
* Redis (cache - Cache Aside pattern)
* Swagger (API documentation)

----

## 🚀 Running the Project

### Backend

```bash
npm run dev
```

### Database (Docker)

```bash
docker start evolution-crm-db
```

> Make sure the database is running before starting the application.

---
## 🧠 Architectural Principles

This project follows solid software engineering principles to ensure scalability, maintainability, and clarity:

* **Low coupling and high cohesion**
* **Clear separation of responsibilities (well-defined layers)**
* **Domain-oriented design (DDD-lite)**
* **Testability (unit, integrationm, E2E)**
* **Horizontal scalability**
* **Conscious resource usage (cache, messaging)**

---
## 📦 Expected Project Structure

The application should follow a feature-based modular architecture:

```
src/
├── app.module.ts
├── test/
├── shared/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   └── configuration.ts
├── migrations/
├── application/
│   └── usecase/
    │   ├── user
    │   ├── company
    │   ├── usecase.module.ts
    └── validator/
    │   ├── user
    │   ├── company
    │   └── validator.module.ts
└── modules/
    └── users/
      ├── users.module.ts
      ├── users.controller.ts
      ├── users.service.ts
      ├── users.repository.ts   ← abstração opcional do ORM
      ├── dto/
      │   ├── create-user.dto.ts
      │   └── update-user.dto.ts
└── infraestructure/
    └── persistence
    │   └── entities/
    │   │   └── user.entity.ts
    └── database.module.ts
```

----
## Conventions
- architecture skills at: [`skills/architecture/SKILL.md`](./skills/architecture/SKILL.md)
- Best practices NestJS skill at: [`/skills/nestjs/SKILL.md`](./skills/nestjs-best-pratice/SKILL.md)

---

## 📄 Documentation Rules

Whenever there are relevant changes:

* Update this file (CLAUDE.md)
* Update complementary docs (if any)
* Create well-defined tasks

---

## 📚 API Documentation

* Swagger must be kept up to date
* Every new route must include:

  * Clear description
  * Typed DTOs
  * Request/response examples

---

## 🤖 AI Development Guidelines

This project is developed with AI assistance. Therefore:

### When creating or modifying code:

* Follow NestJS best practices
* Maintain consistency with the existing architecture
* Avoid logic duplication
* Prefer clear abstractions

### When working with AI (prompts, RAG, workflows):

* Structure prompts explicitly and deterministically
* Avoid ambiguity
* Document important decisions
* Use Spec-Driven Development (SDD) whenever possible

---

## ✅ Definition of Done

A feature is considered complete when:

* Code follows the defined architecture
* Basic tests are implemented
* Documentation is updated
* Swagger is updated
* Code is reviewed (even if by AI)

---

## 📌 Notes

This document should be treated as the single source of truth for architectural decisions and project standards.


