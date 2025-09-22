# 🚀 Instruções de Deploy - Game List Mobile

## ⚠️ **IMPORTANTE: Antes de fazer o deploy, siga estes passos:**

### **1. Configurar URL da API**

No arquivo `frontend/src/services/api.ts`, linha 8, substitua:

```typescript
// ❌ ANTES (não funciona):
: 'https://SEU-APP.railway.app';

// ✅ DEPOIS (substitua pela URL real):
: 'https://SEU-APP-REAL.railway.app';
```

**Como descobrir a URL:**
1. Faça deploy no Railway primeiro
2. Copie a URL que o Railway gerar
3. Substitua no arquivo `api.ts`
4. Faça commit e push novamente

---

### **2. Configurar Variáveis de Ambiente no Railway**

No Railway, vá em **"Variables"** e adicione:

```
DATABASE_TYPE=postgres
JWT_SECRET=seu-jwt-secret-super-seguro-aqui-mude-esta-senha
NODE_ENV=production
PORT=3000
```

**⚠️ IMPORTANTE:** Mude o `JWT_SECRET` para uma senha segura!

---

### **3. Configurar Banco de Dados**

No Railway:
1. Clique em **"New"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. Railway criará automaticamente a variável `DATABASE_URL`

---

## 🎯 **Sequência de Deploy:**

### **Passo 1: Deploy do Backend**
```bash
# 1. Fazer commit das mudanças
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Conectar no Railway
# - Acesse railway.app
# - Conecte seu repositório GitHub
# - Configure as variáveis de ambiente
# - Adicione o banco PostgreSQL
```

### **Passo 2: Atualizar URL da API**
```bash
# 1. Copie a URL do Railway (ex: https://game-list-backend-production.railway.app)
# 2. Edite frontend/src/services/api.ts
# 3. Substitua 'https://SEU-APP.railway.app' pela URL real
# 4. Commit e push
git add .
git commit -m "Update API URL for production"
git push origin main
```

### **Passo 3: Build do Frontend**
```bash
cd frontend
eas build --platform android --profile production
```

---

## ✅ **Verificação Final:**

### **Backend funcionando se:**
- ✅ Railway mostra "Deployed successfully"
- ✅ Acessar `https://SUA-URL.railway.app` retorna dados
- ✅ Swagger em `https://SUA-URL.railway.app/api`

### **Frontend funcionando se:**
- ✅ APK instalado no celular
- ✅ App abre sem erros
- ✅ Consegue fazer login/registro
- ✅ Dados são salvos e carregados

---

## 🆘 **Se algo não funcionar:**

### **Backend não conecta:**
- Verificar se as variáveis de ambiente estão corretas
- Verificar se o banco PostgreSQL está ativo
- Verificar logs no Railway

### **App não carrega dados:**
- Verificar se a URL da API está correta
- Verificar se o usuário está logado
- Verificar se o token está válido

### **Erro de autenticação:**
- Verificar se o JWT_SECRET está configurado
- Verificar se o token não expirou
- Fazer logout e login novamente

---

## 🎉 **Resultado Esperado:**

Com tudo configurado corretamente, você terá:

- ✅ **Backend na nuvem** funcionando 24/7
- ✅ **Banco PostgreSQL** com dados persistentes
- ✅ **App mobile** funcionando em qualquer dispositivo
- ✅ **Autenticação** com dados separados por usuário
- ✅ **Sincronização** automática entre dispositivos

**Agora sim, o app vai comunicar com o banco e funcionar normalmente!** 🚀
