# Forum Web

React + TypeScript + Vite frontend for the forum.

## Setup

````bash
cp .env.example .env
npm install
npm run dev
Open http://localhost:5173.

Requires the backend (forum-api) running on http://localhost:3000.

Scripts
npm run dev — dev server with HMR

npm run build — production build to dist/

npm run preview — serve the production build locally

npx tsc --noEmit — type-check without emitting

Structure
src/pages/ — route components

src/components/ — reusable UI

src/contexts/ — AuthProvider

src/lib/api.ts — fetch wrapper with auth

src/types/forum.ts — shared types (copy of backend shared/forum-types.ts)

text

---

### 9. `forum-api/README.md`

```md
# Forum API

NestJS + TypeORM + SQLite REST API for the forum.

## Setup

```bash
cp .env.example .env
npm install
npm run start:dev
Runs on http://localhost:3000. SQLite DB is created in forum.db on first run. Schema is auto-synced (synchronize: true — dev only).

Endpoints
POST /auth/register, POST /auth/login, GET /auth/me

GET /posts, GET /posts/:id, POST /posts, PATCH /posts/:id, DELETE /posts/:id

GET /posts/:postId/comments, POST /posts/:postId/comments, DELETE /comments/:id

GET /categories

Auth
JWT in Authorization: Bearer <token>. Secret from JWT_SECRET. Tokens expire per JWT_EXPIRES_IN (default 7d).

Scripts
npm run start:dev — watch mode

npm run build — compile to dist/

npm run start:prod — run the compiled build

text

---

### 10. Test the production build

**Frontend:**
```bash
cd forum-web
npm run build
npm run preview
Preview runs at http://localhost:4173. Open it. The app must work identically to dev. Common failures:

Console error about import.meta.env.VITE_API_URL being undefined → .env not loaded (rebuild with .env in place).

CORS blocks → backend's FRONTEND_URL doesn't include http://localhost:4173. Add it temporarily, or set FRONTEND_URL=http://localhost:4173.

Do a full flow on the preview build: login, browse, create post, add comment, delete. If it works here, it'll work in production.

Backend:

bash
cd forum-api
npm run build
npm run start:prod
start:prod runs from dist/, not src/. If start:prod fails, it means something (a file path, an env var, an import extension) doesn't survive compilation. That's exactly why you test it before deploying.
````
