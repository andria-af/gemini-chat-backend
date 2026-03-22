# 🤖 Gemini Chat — Backend

API desenvolvida em **NestJS** com as atividades:

- autenticação simples de usuários
- gerenciamento de conversas e mensagens
- integração com a API do **Google Gemini**
- comunicação em tempo real via **WebSocket (Socket.IO)**

## Tecnologias:

- Node.js
- NestJS
- Prisma
- PostgreSQL (Neon)
- Socket.IO
- Google Generative AI

### Deploy Render: https://gemini-chat-backend-xn88.onrender.com

## Requisitos

- Node.js 22.13+ (recomendado)
- npm 10+

```bash
nvm install 22.13.0
nvm use 22.13.0
```

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:npg_UiafZ8egS0pq@ep-damp-fog-ady0e976-pooler.c-2.us-east-1.aws.neon.tech/gemini-chat-db?sslmode=require&channel_binding=require"
FRONTEND_URL="http://localhost:5173"
GEMINI_API_KEY="AIzaSyDLdsoYGsi7VWtvDG_Oxbei8SXSYYY2_bw"
PORT=3000
```

## ▶️ Como rodar o projeto local:

```bash
npx prisma generate
npm run start:dev
```

### Build produção

```bash
npm run build
npm run start:prod
```

## Principais endpoints

### Auth

- `POST /auth/login`

### Conversations

- `POST /conversations`
- `GET /conversations/user/:userId`
- `GET /conversations/:id/messages`

### Chat

- `POST /chat/message`

### Observações

- A autenticação simplificada (username sem senha)
- As mensagens são persistidas no banco PostgreSQL (Neon).
- Foi usado WebSocket para atualização em tempo real das mensagens.

---
