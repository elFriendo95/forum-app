# Forum

A minimal forum with users, posts, comments, and categories.

- **Backend**: NestJS + TypeORM + SQLite → `forum-api/`
- **Frontend**: React + Vite + TypeScript → `forum-web/`

## Prerequisites

- Node.js 18+
- npm 9+

## Quick start

**Terminal 1 — backend:**

```bash
cd forum-api
cp .env.example .env   # then edit .env and set JWT_SECRET
npm install
npm run start:dev
```

Backend at http://localhost:3000.

Terminal 2 — frontend:

```bash
cd forum-web
cp .env.example .env
npm install
npm run dev
```

Frontend at http://localhost:5173.

First backend run creates forum-api/forum.db and seeds three categories. Register an account and start posting.

Features
JWT-based register / login

Create / edit / delete posts (owner-only)

Comments with owner-only delete

Filter posts by category, search by title

Pagination

Protected frontend routes

Layout
text
forum-api/ NestJS backend
forum-web/ React frontend
Each subproject has its own README.md with more detail.

License
MIT

text

```

```
