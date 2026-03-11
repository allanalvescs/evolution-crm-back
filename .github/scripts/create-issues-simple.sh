#!/bin/bash

# Script para criar issues usando curl com token
# Uso: ./create-issues-simple.sh <GITHUB_TOKEN>

TOKEN="$1"
REPO="allanalvescs/evolution-crm-back"

if [ -z "$TOKEN" ]; then
    echo "❌ Erro: Forneça o token como argumento"
    echo "Uso: $0 <GITHUB_TOKEN>"
    exit 1
fi

echo "🚀 Criando issues no repositório $REPO..."
echo ""

# EPIC 1
echo "📝 Criando EPIC 1..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[EPIC] Estabelecer Fundação DDD",
    "body": "## 🎯 EPIC 1: Estabelecer Fundação DDD\n\n**Prioridade:** CRÍTICA\n**Story Points:** 34\n\n### Objetivo\nEstabelecer as bases do Domain-Driven Design (DDD) no projeto, criando Value Objects, transformando entidades anêmicas em agregados ricos e implementando eventos de domínio.\n\n### User Stories Relacionadas\n- [ ] Criar Value Objects do Domínio Client (8 pts)\n- [ ] Refatorar Client como Agregado Rico (13 pts)\n- [ ] Implementar Domain Events (8 pts)\n- [ ] Criar Domain Services (5 pts)\n\n### Definição de Pronto\n- ✅ Todos os Value Objects criados e testados\n- ✅ Entidade Client com comportamentos de negócio\n- ✅ Sistema de eventos funcionando\n- ✅ Cobertura de testes > 80%",
    "labels": ["epic", "architecture", "ddd", "priority:critical"]
  }' | jq -r '.number // .message'

sleep 2

# US-001
echo "📝 Criando US-001..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-001] Criar Value Objects do Domínio Client",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar Value Objects para CPF/CNPJ, Email, Phone, Address\n**Para que** garantir validações e imutabilidade no domínio\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar `CpfCnpj` Value Object com validação\n- [ ] Criar `Email` Value Object\n- [ ] Criar `Phone` Value Object\n- [ ] Criar `Address` Value Object\n- [ ] Escrever testes unitários (100% cobertura)\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ CpfCnpj valida CPF e CNPJ\n2. ✅ Todos os VOs são imutáveis\n3. ✅ Cobertura de testes ≥ 95%\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P0 (Crítica)\n**Epic:** #5",
    "labels": ["user-story", "ddd", "priority:p0", "points:8"]
  }' | jq -r '.number // .message'

sleep 2

# US-002
echo "📝 Criando US-002..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-002] Refatorar Client como Agregado Rico",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** transformar Client em agregado com comportamentos\n**Para que** encapsular regras de negócio no domínio\n\n---\n\n## 📋 Tarefas\n\n- [ ] Construtor privado + factory method `Client.create()`\n- [ ] Implementar `updateInfo()` com validações\n- [ ] Implementar `addAddress()` / `updateAddress()`\n- [ ] Adicionar `deactivate()` / `activate()`\n- [ ] Garantir invariantes do agregado\n- [ ] Testes unitários completos\n\n---\n\n## ✅ Critérios de Aceitação\n\n1. ✅ Construtor privado\n2. ✅ Factory method valida tudo\n3. ✅ Impossível criar Client inválido\n4. ✅ Métodos emitem eventos\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 13\n**Prioridade:** P0 (Crítica)\n**Epic:** #5\n**Depende de:** #6",
    "labels": ["user-story", "ddd", "priority:p0", "points:13"]
  }' | jq -r '.number // .message'

sleep 2

# US-003
echo "📝 Criando US-003..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-003] Implementar Domain Events",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar eventos de domínio\n**Para que** desacoplar contextos\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar `DomainEvent` base\n- [ ] Criar `AggregateRoot`\n- [ ] Criar `ClientCreatedEvent`\n- [ ] Criar `ClientUpdatedEvent`\n- [ ] Implementar `EventDispatcher`\n- [ ] Testes unitários\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P1 (Alta)\n**Epic:** #5",
    "labels": ["user-story", "ddd", "priority:p1", "points:8"]
  }' | jq -r '.number // .message'

sleep 2

# US-004
echo "📝 Criando US-004..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-004] Criar Domain Services",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar serviços de domínio\n**Para que** manter entidades focadas\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar `ClientValidationDomainService`\n- [ ] Mover validação de duplicidade\n- [ ] Criar `validateUniqueEmail()`\n- [ ] Testes unitários\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 5\n**Prioridade:** P1 (Alta)\n**Epic:** #5",
    "labels": ["user-story", "ddd", "priority:p1", "points:5"]
  }' | jq -r '.number // .message'

sleep 2

# EPIC 2
echo "📝 Criando EPIC 2..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[EPIC] Corrigir Clean Architecture",
    "body": "## 🏗️ EPIC 2: Corrigir Clean Architecture\n\n**Prioridade:** ALTA\n**Story Points:** 21\n\n### Objetivo\nReorganizar o código para aderir aos princípios de Clean Architecture.\n\n### User Stories\n- [ ] Separar Camada de Interface (8 pts)\n- [ ] Refatorar UseCases (8 pts)\n- [ ] Inverter Dependências (5 pts)\n\n### Violações Identificadas\n1. ❌ Controllers misturados com lógica\n2. ❌ UseCases incompletos\n3. ❌ Dependências invertidas",
    "labels": ["epic", "architecture", "clean-architecture", "priority:high"]
  }' | jq -r '.number // .message'

sleep 2

# US-005
echo "📝 Criando US-005..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-005] Separar Camada de Interface",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** mover controllers para `interface/http/rest`\n**Para que** respeitar separação de camadas\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar estrutura `interface/http/`\n- [ ] Mover controllers\n- [ ] Mover guards/filters\n- [ ] Atualizar imports\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P0\n**Epic:** #10",
    "labels": ["user-story", "clean-architecture", "priority:p0", "points:8", "refactor"]
  }' | jq -r '.number // .message'

sleep 2

# US-006
echo "📝 Criando US-006..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-006] Refatorar UseCases com Lógica Completa",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** implementar lógica completa em UseCases\n**Para que** UseCases orquestrem o fluxo\n\n---\n\n## 📋 Tarefas\n\n- [ ] Implementar criação completa\n- [ ] Remover lógica de Services\n- [ ] Adicionar domain service\n- [ ] Disparar eventos\n- [ ] Testes unitários\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P0\n**Epic:** #10",
    "labels": ["user-story", "clean-architecture", "priority:p0", "points:8"]
  }' | jq -r '.number // .message'

sleep 2

# US-007
echo "📝 Criando US-007..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-007] Inverter Dependência de Serviços Externos",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar interface `ICnpjService`\n**Para que** Application não dependa de Infrastructure\n\n---\n\n## 📋 Tarefas\n\n- [ ] Criar interface em `application/`\n- [ ] Implementar em `infrastructure/`\n- [ ] Configurar DI\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 5\n**Prioridade:** P0\n**Epic:** #10",
    "labels": ["user-story", "clean-architecture", "priority:p0", "points:5"]
  }' | jq -r '.number // .message'

sleep 2

# EPIC 3
echo "📝 Criando EPIC 3..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[EPIC] Cobertura de Testes",
    "body": "## 🧪 EPIC 3: Cobertura de Testes\n\n**Prioridade:** ALTA\n**Story Points:** 34\n\n### Objetivo\nAlcançar 80%+ de cobertura\n\n### Situação Atual\n- ✅ Auth: ~80%\n- ❌ Client: 0%\n- ❌ Domain: 0%\n- ❌ UseCases: 0%\n\n### Meta\n- 🎯 Geral: 80%+\n- 🎯 Domain: 95%+\n- 🎯 Application: 85%+",
    "labels": ["epic", "testing", "priority:high"]
  }' | jq -r '.number // .message'

sleep 2

# US-008
echo "📝 Criando US-008..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-008] Testes Unitários - Domain Layer",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar testes para entidades de domínio\n**Para que** garantir comportamentos corretos\n\n---\n\n## 📋 Tarefas\n\n- [ ] Testes Client entity\n- [ ] Testes Value Objects\n- [ ] Testes Domain Services\n- [ ] Cobertura ≥ 95%\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 13\n**Prioridade:** P0\n**Epic:** #13",
    "labels": ["user-story", "testing", "unit-test", "priority:p0", "points:13"]
  }' | jq -r '.number // .message'

sleep 2

# US-009
echo "📝 Criando US-009..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-009] Testes Unitários - Application Layer",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar testes para UseCases\n**Para que** garantir orquestração correta\n\n---\n\n## 📋 Tarefas\n\n- [ ] CreateClientUseCase.spec.ts\n- [ ] UpdateClientUseCase.spec.ts\n- [ ] DeleteClientUseCase.spec.ts\n- [ ] Testar eventos\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 13\n**Prioridade:** P1\n**Epic:** #13",
    "labels": ["user-story", "testing", "unit-test", "priority:p1", "points:13"]
  }' | jq -r '.number // .message'

sleep 2

# US-010
echo "📝 Criando US-010..."
curl -s -X POST "https://api.github.com/repos/$REPO/issues" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{
    "title": "[US-010] Testes de Integração - Infrastructure",
    "body": "## 👤 User Story\n\n**Como** desenvolvedor\n**Quero** criar testes de integração\n**Para que** validar persistência\n\n---\n\n## 📋 Tarefas\n\n- [ ] Setup BD teste (Docker)\n- [ ] ClientRepository.integration.spec.ts\n- [ ] UserRepository.integration.spec.ts\n- [ ] Testar mappers\n\n---\n\n## 📊 Estimativa\n\n**Story Points:** 8\n**Prioridade:** P1\n**Epic:** #13",
    "labels": ["user-story", "testing", "integration-test", "priority:p1", "points:8"]
  }' | jq -r '.number // .message'

echo ""
echo "✅ Processo concluído!"
echo "📊 Acesse: https://github.com/$REPO/issues"
