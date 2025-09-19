# 🚀 Guia de Deploy - Game List Mobile

Este guia te ajudará a colocar sua aplicação na nuvem para funcionar em múltiplos dispositivos com dados separados por usuário.

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app) (gratuita)
- Conta no [Expo](https://expo.dev) (gratuita)
- Git configurado

## 🎯 O que foi implementado

### ✅ Backend
- Sistema de autenticação JWT
- Entidade User para separar dados por usuário
- Suporte a PostgreSQL (nuvem) e SQLite (local)
- Configuração para deploy automático

### ✅ Frontend
- Serviços de autenticação
- Armazenamento local de tokens
- Configuração para API local/produção

---

## 🚀 Deploy do Backend (Railway)

### 1. Preparar o Repositório

```bash
# No terminal, na pasta do projeto
git init
git add .
git commit -m "Initial commit with authentication"
```

### 2. Criar Conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Conecte seu repositório

### 3. Configurar Variáveis de Ambiente

No Railway, vá em "Variables" e adicione:

```
DATABASE_TYPE=postgres
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
NODE_ENV=production
PORT=3000
```

### 4. Configurar Banco de Dados

1. No Railway, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente a variável `DATABASE_URL`

### 5. Deploy Automático

O Railway fará deploy automaticamente quando você fizer push para o repositório.

---

## 📱 Deploy do Frontend (Expo)

### 1. Atualizar URL da API

No arquivo `frontend/src/services/api.ts`, substitua:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.5:3000'  // Desenvolvimento local
  : 'https://SEU-APP.railway.app';  // URL do seu backend no Railway
```

### 2. Build do App

```bash
cd frontend
eas build --platform android --profile production
```

### 3. Distribuir o APK

- O EAS criará um link para download
- Compartilhe o link com os usuários
- Ou publique na Google Play Store

---

## 🔐 Como Funciona a Autenticação

### 1. Registro de Usuário
```typescript
const { token, user } = await authService.register({
  email: 'usuario@email.com',
  name: 'Nome do Usuário',
  password: 'senha123'
});
```

### 2. Login
```typescript
const { token, user } = await authService.login({
  email: 'usuario@email.com',
  password: 'senha123'
});
```

### 3. Dados Separados
- Cada usuário tem suas próprias listas e itens
- O token JWT identifica o usuário
- Dados são isolados por `userId`

---

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas Automaticamente:

```sql
-- Usuários
users (id, email, password, name, createdAt, updatedAt)

-- Listas (vinculadas ao usuário)
lists (id, name, type, description, userId, createdAt, updatedAt)

-- Itens (vinculados às listas)
items (id, title, type, status, description, genre, releaseYear, rating, notes, imageUrl, platform, listId, createdAt, updatedAt)
```

---

## 🎮 Como Usar em Múltiplos Dispositivos

### 1. Instalar o App
- Baixar o APK do link gerado pelo EAS
- Instalar no celular

### 2. Criar Conta
- Abrir o app
- Clicar em "Registrar"
- Preencher dados (email, nome, senha)

### 3. Fazer Login
- Usar email e senha criados
- Dados serão sincronizados automaticamente

### 4. Usar em Outros Dispositivos
- Instalar o mesmo APK
- Fazer login com a mesma conta
- Dados aparecerão automaticamente

---

## 🔧 Comandos Úteis

### Backend
```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run start:dev

# Build para produção
npm run build

# Executar em produção
npm run start:prod
```

### Frontend
```bash
# Instalar dependências
npm install

# Desenvolvimento
npm start

# Build APK
eas build --platform android --profile production
```

---

## 🛠️ Solução de Problemas

### Backend não conecta
- Verificar se as variáveis de ambiente estão corretas
- Verificar se o banco PostgreSQL está ativo
- Verificar logs no Railway

### App não carrega dados
- Verificar se a URL da API está correta
- Verificar se o usuário está logado
- Verificar se o token está válido

### Erro de autenticação
- Verificar se o JWT_SECRET está configurado
- Verificar se o token não expirou (7 dias)
- Fazer logout e login novamente

---

## 📈 Próximos Passos

1. **Implementar telas de login/registro** no frontend
2. **Adicionar validação de formulários**
3. **Implementar recuperação de senha**
4. **Adicionar notificações push**
5. **Implementar modo offline**
6. **Adicionar backup na nuvem**

---

## 🎉 Resultado Final

Com essa configuração, você terá:

- ✅ **App funcionando em múltiplos dispositivos**
- ✅ **Dados separados por usuário**
- ✅ **Sincronização automática**
- ✅ **Backend na nuvem (sempre online)**
- ✅ **Banco de dados seguro**
- ✅ **Autenticação JWT**

**Agora qualquer pessoa pode baixar seu app, criar uma conta e ter suas próprias listas de jogos/filmes/séries!** 🎮📱
