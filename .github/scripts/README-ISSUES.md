# 🔧 Guia para Criar Issues no GitHub

## ⚠️ Problema: Token sem Permissões

O token fornecido não possui permissões adequadas para criar issues via API.

## ✅ Soluções Disponíveis

### Opção 1: Instalar GitHub CLI (Recomendado)

```bash
# Instalar gh (se ainda não tiver)
# Ubuntu/Debian
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh

# Arch Linux
sudo pacman -S github-cli

# macOS
brew install gh

# Autenticar
gh auth login

# Criar issues
node scripts/create-issues-with-gh.js
```

### Opção 2: Criar Manualmente (Web)

**Total:** 13 issues a criar

1. Acesse: https://github.com/allanalvescs/evolution-crm-back/issues/new
2. Copie cada issue do arquivo `docs/BACKLOG.md`
3. Cole título e descrição
4. Adicione as labels sugeridas

**Estimativa de tempo:** ~15-20 minutos

### Opção 3: Gerar Fine-Grained Token

Para usar a API REST, você precisa de um **Fine-Grained Personal Access Token**:

1. Acesse: https://github.com/settings/tokens?type=beta
2. Clique em **Generate new token** (Beta)
3. **Token name:** `Evolution CRM Issues`
4. **Repository access:** Selecione `Only select repositories` → `evolution-crm-back`
5. **Permissions:**
   - Repository permissions:
     - ✅ **Issues:** Read and write
     - ✅ **Metadata:** Read-only (automático)
6. Clique em **Generate token**
7. Copie e execute:

```bash
export GITHUB_TOKEN="seu_novo_token_aqui"
./scripts/create-backlog-issues.sh $GITHUB_TOKEN
```

## 📊 Resumo das Issues

| Epic | Issues | Story Points |
|------|--------|--------------|
| EPIC 1 - Fundação DDD | 4 | 34 |
| EPIC 2 - Clean Architecture | 3 | 21 |
| EPIC 3 - Testes | 3 | 34 |
| **TOTAL** | **10** | **89** |

## 🚀 Próximos Passos

Após criar as issues:

1. Revisar prioridades no board do GitHub
2. Iniciar Sprint 0 (34 pontos)
3. Começar pela US-001 (Value Objects)

---

**Documentação completa:** Ver `docs/BACKLOG.md`
