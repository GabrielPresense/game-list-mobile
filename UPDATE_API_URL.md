# 🔄 Atualizar URL da API

## ⚠️ **IMPORTANTE: Execute este passo APÓS o Railway fazer o deploy!**

### **1. Obter URL do Railway:**
1. No Railway, vá para seu projeto
2. Clique na aba **"Deployments"**
3. Copie a URL que aparece (ex: `https://game-list-mobile-production.railway.app`)

### **2. Atualizar o Frontend:**
Edite o arquivo `frontend/src/services/api.ts` na linha 8:

```typescript
// ❌ ANTES:
: 'https://SEU-APP.railway.app';

// ✅ DEPOIS (substitua pela URL real):
: 'https://SUA-URL-REAL.railway.app';
```

### **3. Fazer Commit e Push:**
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### **4. Build do APK:**
```bash
cd frontend
eas build --platform android --profile production
```

---

## 🎯 **URL será algo como:**
- `https://game-list-mobile-production.railway.app`
- `https://game-list-mobile-production-abc123.railway.app`
- `https://game-list-mobile-production-def456.railway.app`

**Copie exatamente como aparece no Railway!**
