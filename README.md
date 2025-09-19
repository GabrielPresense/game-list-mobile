# 🎮 Game List Mobile - Aplicação Completa

Sistema completo para gerenciar listas de jogos, filmes e séries com autenticação de usuários e sincronização na nuvem.

## 🚀 **Deploy Rápido**

### **Opção 1: Deploy Automático (Recomendado)**

1. **Fork este repositório**
2. **Conecte no [Railway](https://railway.app)**
3. **Deploy automático** - Backend + Frontend funcionando!

### **Opção 2: Desenvolvimento Local**

```bash
# 1. Clonar o repositório
git clone https://github.com/SEU-USUARIO/game-list-mobile.git
cd game-list-mobile

# 2. Backend
cd backend
npm install
npm run start:dev

# 3. Frontend (novo terminal)
cd frontend
npm install
npm start
```

## 📱 **Funcionalidades**

- ✅ **Autenticação de usuários** (registro/login)
- ✅ **Listas personalizadas** (jogos, filmes, séries)
- ✅ **Dados separados por usuário**
- ✅ **Sincronização na nuvem**
- ✅ **Funciona em múltiplos dispositivos**
- ✅ **API REST completa**
- ✅ **Documentação Swagger**

## 🏗️ **Estrutura do Projeto**

```
game-list-mobile/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # Autenticação JWT
│   │   │   ├── lists/       # CRUD de listas
│   │   │   └── items/       # CRUD de itens
│   │   └── common/
│   │       ├── entities/    # Entidades do banco
│   │       └── dto/         # Data Transfer Objects
│   └── package.json
├── frontend/                # App React Native
│   ├── src/
│   │   ├── screens/         # Telas do app
│   │   ├── services/        # Serviços da API
│   │   └── types/           # Tipos TypeScript
│   └── package.json
└── DEPLOY_GUIDE.md          # Guia completo de deploy
```

## 🔧 **Tecnologias**

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados (produção)
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação
- **Swagger** - Documentação da API

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **Axios** - Cliente HTTP

## 🌐 **Deploy na Nuvem**

### **Backend (Railway)**
- ✅ Deploy automático
- ✅ Banco PostgreSQL
- ✅ Variáveis de ambiente
- ✅ HTTPS automático

### **Frontend (EAS Build)**
- ✅ Build de APK
- ✅ Distribuição automática
- ✅ Atualizações OTA

## 📊 **Banco de Dados**

### Tabelas
- **users** - Usuários do sistema
- **lists** - Listas (jogos, filmes, séries)
- **items** - Itens das listas

### Relacionamentos
- Usuário → Listas (1:N)
- Lista → Itens (1:N)

## 🔐 **Autenticação**

- **Registro** de novos usuários
- **Login** com email/senha
- **JWT tokens** para segurança
- **Dados isolados** por usuário

## 📱 **Como Usar**

1. **Instalar o app** (APK)
2. **Criar conta** (email + senha)
3. **Fazer login**
4. **Criar listas** (jogos, filmes, séries)
5. **Adicionar itens** às listas
6. **Usar em outros dispositivos** (mesma conta)

## 🚀 **Deploy Completo**

Veja o arquivo `DEPLOY_GUIDE.md` para instruções detalhadas de deploy.

## 📞 **Suporte**

- **Issues** - Reportar problemas
- **Discussions** - Dúvidas e sugestões
- **Wiki** - Documentação completa

## 📄 **Licença**

Este projeto é de uso livre para fins educacionais e pessoais.

## Endpoints da API

### Listas
- `GET /lists` - Listar todas as listas
- `GET /lists/:id` - Buscar lista por ID
- `POST /lists` - Criar nova lista
- `PATCH /lists/:id` - Atualizar lista
- `DELETE /lists/:id` - Excluir lista
- `GET /lists?type=TIPO` - Filtrar por tipo

### Itens
- `GET /items` - Listar todos os itens
- `GET /items/:id` - Buscar item por ID
- `POST /items` - Criar novo item
- `PATCH /items/:id` - Atualizar item
- `DELETE /items/:id` - Excluir item
- `GET /items?listId=ID` - Filtrar por lista
- `GET /items?type=TIPO` - Filtrar por tipo
- `GET /items?status=STATUS` - Filtrar por status
- `GET /items?search=TEXTO` - Buscar por texto

## Tipos de Dados

### Lista (List)
```typescript
{
  id: number;
  name: string;
  type: 'games_played' | 'games_to_play' | 'movies_watched' | 'movies_to_watch' | 'series_watched' | 'series_to_watch';
  description?: string;
  items?: Item[];
  createdAt: string;
  updatedAt: string;
}
```

### Item
```typescript
{
  id: number;
  title: string;
  type: 'game' | 'movie' | 'series';
  status: 'completed' | 'want_to_play_watch' | 'in_progress' | 'dropped';
  description?: string;
  genre?: string;
  releaseYear?: number;
  rating?: number; // 0-10
  notes?: string;
  imageUrl?: string;
  platform?: string;
  listId: number;
  list?: List;
  createdAt: string;
  updatedAt: string;
}
```

## Tecnologias Utilizadas

### Backend
- **NestJS**: Framework Node.js para APIs escaláveis
- **TypeScript**: Superset do JavaScript com tipagem estática
- **TypeORM**: ORM para TypeScript e JavaScript
- **SQLite**: Banco de dados leve para desenvolvimento
- **class-validator**: Validação de dados
- **Swagger**: Documentação automática da API
- **CORS**: Habilitado para acesso cross-origin

### Frontend
- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para desenvolvimento React Native
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **Axios**: Cliente HTTP para consumir a API
- **Expo Vector Icons**: Ícones para a interface

## Estrutura do Banco de Dados

O banco SQLite é criado automaticamente com as seguintes tabelas:

- **lists**: Armazena as listas de jogos/filmes/séries
- **items**: Armazena os itens individuais (jogos, filmes, séries)

As tabelas são criadas automaticamente pelo TypeORM na primeira execução.

## Desenvolvimento

### Comandos Úteis

**Backend:**
```bash
npm run build          # Compilar para produção
npm run start:prod     # Executar em produção
npm run test           # Executar testes
npm run lint           # Verificar código
```

**Frontend:**
```bash
npm run web            # Executar no navegador
npm run ios            # Executar no simulador iOS
npm run android        # Executar no simulador Android
```

### Estrutura de Pastas

**Backend:**
```
src/
├── modules/
│   ├── items/         # Módulo de itens
│   └── lists/         # Módulo de listas
├── common/
│   ├── dto/           # Data Transfer Objects
│   └── entities/      # Entidades do banco
├── config/            # Configurações
└── main.ts           # Arquivo principal
```

**Frontend:**
```
src/
├── components/        # Componentes reutilizáveis
├── screens/          # Telas da aplicação
├── navigation/       # Configuração de navegação
├── services/         # Serviços (API)
├── types/           # Tipos TypeScript
└── utils/           # Utilitários
```

## Próximos Passos

Para melhorar o sistema, você pode:

1. **Adicionar autenticação** (JWT, OAuth)
2. **Implementar upload de imagens** 
3. **Adicionar notificações push**
4. **Criar sistema de avaliações e reviews**
5. **Integrar com APIs externas** (TMDB, IGDB)
6. **Adicionar modo offline**
7. **Implementar sincronização na nuvem**
8. **Criar versão web** (React)

## Suporte

Para dúvidas ou problemas:
1. Verificar se o backend está rodando na porta 3000
2. Confirmar se o IP está correto no arquivo `api.ts`
3. Verificar se o CORS está habilitado
4. Consultar os logs do console para erros

## Licença

Este projeto é de uso livre para fins educacionais e pessoais.

