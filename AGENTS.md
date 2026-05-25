# AGENTS.md

## Cursor Cloud specific instructions

### Tech Stack
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS (App Router)
- **Backend**: Custom Node.js server wrapping Next.js + Socket.IO for WebSocket
- **Database**: Prisma ORM 7 + SQLite (via `@prisma/adapter-better-sqlite3`)

### Running the app
```bash
npm run dev          # starts custom server (Next.js + Socket.IO) on port 3000
npm run db:seed      # seeds default chat rooms (General, Random, Tech)
npm run db:migrate   # runs Prisma migrations
npm run lint         # ESLint
npm run build        # production build
```

### Key gotchas
- **Prisma 7** requires a driver adapter (`PrismaBetterSqlite3`) — you cannot just do `new PrismaClient()`. Every file that instantiates PrismaClient must pass `{ adapter }`.
- The dev server is a **custom `server.ts`** (not `next dev`). It wraps Next.js with `http.createServer` to attach Socket.IO on the same port.
- Database file is at `./dev.db` (relative to workspace root). The `.env` file sets `DATABASE_URL="file:./dev.db"`.
- After cloning, you need to run `npx prisma migrate dev` and `npm run db:seed` to set up the database.
- `"type": "module"` is set in `package.json` — all imports use ESM.
