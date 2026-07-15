# AI-BOS Command Center v2

Mission Control Dashboard for the AI Business Operating System.

## Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS 4**
- **File-based JSON data store** (`data/` directory)
- **Production mode** (does not use static export — API routes are server-rendered)

## Quick Start

```bash
npm install
npm run build
npm start       # runs on http://localhost:3000
```

For development with hot reload:
```bash
npm run dev
```

## Pages

| Route | Description |
|---|---|
| `/` | Main dashboard with KPI cards, pipeline, tasks, activity, agents |
| `/pipeline` | Kanban-style pipeline stages |
| `/crm` | Deals table |
| `/finance` | Invoices and financial summary |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | System health |
| GET | `/api/dashboard` | Dashboard KPI summary |
| GET | `/api/batch` | Dashboard + all data in one call |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/deals` | List deals with pipeline rollup |
| POST | `/api/deals` | Create deal |
| GET | `/api/finance` | Invoices + financial summary |
| GET | `/api/agents` | Agent status |
| GET | `/api/activity` | Activity feed |
| GET/PUT | `/api/company` | Company configuration |
| POST | `/api/seed` | Seed demo data |
| PATCH/DELETE | `/api/tasks/:id` | Update/delete task |
| PATCH/DELETE | `/api/deals/:id` | Update/delete deal |
| PATCH | `/api/invoices/:id` | Update invoice |

## Demo Data

Run once after first start:
```bash
curl -X POST http://localhost:3000/api/seed
```

This seeds deals, tasks, invoices, agents, and activity entries.

## Deployment

```bash
npm run build
npm start
```

For production daemon use:
```bash
npx next start -p 3000 &
```

## Data Storage

All data persists in the `data/` directory as JSON files. Replace these with PostgreSQL or any database by updating `src/lib/store.js`.

## License

AI-BOS — Mathias Chekanyanza
