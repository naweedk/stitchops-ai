# StitchOps AI — Smart Manufacturing Management Platform

StitchOps AI is an AI-powered manufacturing management platform engineered specifically for small garment manufacturing businesses. It streamlines end-to-end factory operations—from customer order lifecycle and floor worker productivity to fabric inventory forecasting and AI-driven production risk mitigation.

---

## 1. System Architecture

The project is structured as a clean, decoupled full-stack monorepo with independent frontend and backend applications:

```
stitchops-ai/
│
├── frontend/                     # Next.js 16 App Router application (Port 3000)
│   ├── public/                   # Static browser assets
│   ├── src/
│   │   ├── app/                  # App Router routes and Server Component layouts
│   │   │   ├── globals.css       # Core CSS reset
│   │   │   ├── layout.tsx        # Server Component root layout
│   │   │   └── page.tsx          # Responsive landing dashboard
│   │   ├── components/           # Reusable UI components (e.g., BackendStatus)
│   │   ├── features/             # Domain-specific UI features (orders, inventory, etc.)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Shared clients and network abstractions
│   │   ├── providers/            # Client context providers (AppThemeProvider)
│   │   ├── theme/                # Centralized MUI v7 design tokens & palette
│   │   ├── types/                # Frontend TypeScript declarations
│   │   └── utils/                # Pure formatting and helper functions
│   ├── .env.example              # Documented frontend environment template
│   ├── eslint.config.mjs         # Modern ESLint 9 flat configuration
│   ├── next.config.ts            # Next.js TypeScript runtime configuration
│   ├── package.json              # Frontend dependencies and npm scripts
│   └── tsconfig.json             # Strict TypeScript compiler options (@/* path alias)
│
├── backend/                      # NestJS 12 REST API (Port 4000)
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema configured for PostgreSQL
│   ├── src/
│   │   ├── ai/                   # Gemini AI integration service (backend-only)
│   │   ├── analytics/            # Business intelligence and metrics
│   │   ├── auth/                 # Authentication and role-based guards
│   │   ├── common/               # Shared filters, interceptors, and pipes
│   │   ├── config/               # Typed environment configuration
│   │   ├── customers/            # Customer management module
│   │   ├── health/               # Health check status endpoint (/api/health)
│   │   ├── inventory/            # Fabric and raw materials tracking
│   │   ├── orders/               # Production order workflow management
│   │   ├── prisma/               # Global PrismaService lifecycle management
│   │   ├── production/           # Floor capacity and schedule planning
│   │   ├── users/                # User accounts and administrative settings
│   │   ├── workers/              # Worker productivity and tracking
│   │   ├── app.module.ts         # Root NestJS IoC application module
│   │   └── main.ts               # Application entry point, Swagger, CORS, Validation
│   ├── test/                     # Backend unit and E2E integration test suites
│   ├── .env.example              # Documented backend environment template
│   ├── nest-cli.json             # NestJS CLI schematics and build settings
│   ├── package.json              # Backend dependencies and npm scripts
│   └── tsconfig.json             # TypeScript 6 decorator metadata configuration
│
├── .gitignore                    # Comprehensive ignore rules (Node, Next, Nest, Prisma, OS)
└── README.md                     # Project architecture and developer onboarding guide
```

---

## 2. Technology Stack & Confirmed Versions

| Layer | Technology | Version | Purpose / Architectural Note |
|---|---|---|---|
| **Frontend Framework** | Next.js | `16.4.6` | App Router architecture with Server Components by default |
| **UI Library** | React | `19.3.1` | Concurrent rendering with React Server Components (RSC) |
| **Component System** | Material UI (MUI) | `7.3.11` | Primary design system, components, and icon toolkit |
| **CSS Runtime** | Emotion | `11.14.0` | SSR style injection via `useServerInsertedHTML` registry |
| **Frontend Linting** | ESLint | `9.39.5` | Modern flat config (`eslint.config.mjs`) with `next/core-web-vitals` |
| **Backend Framework** | NestJS | `12.4.2` | Modular, enterprise-grade TypeScript REST architecture |
| **API Documentation** | Swagger / OpenAPI | `12.1.1` | Interactive documentation served at `/api/docs` |
| **DTO Validation** | class-validator | `0.15.1` | Runtime validation via NestJS global `ValidationPipe` |
| **Database ORM** | Prisma | `6.19.3` | Type-safe query engine configured for PostgreSQL |
| **Language** | TypeScript | `5.9.3` (FE) / `6.0.3` (BE) | Strict type checking with decorator metadata enabled |
| **Package Manager** | pnpm | `11.0.9` | Fast, deterministic monorepo dependency management |

---

## 3. Core Architectural Concepts (Developer Guide)

### A. Next.js App Router: Server vs. Client Components
- **Server Components (Default)**: Files without `"use client"` run exclusively on the server (e.g., `src/app/layout.tsx`, `src/app/page.tsx`). They output plain HTML, reducing client JavaScript bundle size and enabling direct, secure database/backend access.
- **Client Components**: Marked with `"use client"` at the very top (e.g., `src/providers/ThemeProvider.tsx`, `src/components/BackendStatus.tsx`). Required whenever using React hooks (`useState`, `useEffect`), browser APIs, or interactive event handlers.
- **Rule of Thumb**: Keep pages and layouts as Server Components; extract interactive leaves (dialogs, form inputs, status chips) into dedicated Client Components.

### B. Emotion SSR Registry in Next.js 16
Because Next.js streams HTML chunks during server rendering, runtime CSS-in-JS libraries can cause a Flash of Unstyled Content (FOUC). The custom `AppThemeProvider` in [`frontend/src/providers/ThemeProvider.tsx`](frontend/src/providers/ThemeProvider.tsx) collects Emotion styles on the server using Next.js's `useServerInsertedHTML` hook and injects critical `<style>` tags directly into the HTML stream before it reaches the browser.

### C. NestJS Modular Architecture & Dependency Injection
- **Controllers** (`*.controller.ts`) handle incoming HTTP requests, parse query/body payloads, and immediately delegate to services. No business logic belongs in controllers.
- **Services** (`*.service.ts`) contain all domain and business calculations. They are annotated with `@Injectable()` and injected via constructor dependency injection.
- **DTOs** (`*.dto.ts`) use `class-validator` decorators (`@IsString()`, `@IsNumber()`) and `@ApiProperty()` to enforce payload integrity and automatically generate Swagger docs.
- **Prisma Integration**: [`backend/src/prisma/prisma.service.ts`](backend/src/prisma/prisma.service.ts) wraps the Prisma client with NestJS `onModuleInit` and `onModuleDestroy` lifecycle hooks, gracefully handling offline database states during development.

---

## 4. Prerequisites

Ensure your development machine has the following tools installed:

- **Node.js**: `v22.x` or later (Verified with `v22.22.2`)
- **pnpm**: `v11.x` or later (Verified with `v11.0.9`)
- **Git**: `v2.40+`
- **PostgreSQL**: `v15+` (Required for database design & migrations phase)

---

## 5. Getting Started & Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd stitchops-ai
```

### Step 2: Configure Environment Variables

#### Frontend Configuration
```bash
cd frontend
cp .env.example .env.local
```
Ensure `frontend/.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

#### Backend Configuration
```bash
cd ../backend
cp .env.example .env
```
Ensure `backend/.env` contains:
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stitchops_db?schema=public
GEMINI_API_KEY=
```

### Step 3: Install Dependencies

```bash
# Install frontend dependencies
cd ../frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

---

## 6. Running the Applications

### Development Mode

Run each application in a separate terminal:

#### Terminal 1 — Backend (NestJS)
```bash
cd backend
pnpm start:dev
```
- API Base URL: `http://localhost:4000/api`
- Health Endpoint: `http://localhost:4000/api/health`
- Swagger OpenAPI Documentation: `http://localhost:4000/api/docs`

#### Terminal 2 — Frontend (Next.js)
```bash
cd frontend
pnpm dev
```
- Web Application: `http://localhost:3000`

---

## 7. Available Scripts

### Frontend Scripts (`frontend/`)

| Script | Command | Purpose |
|---|---|---|
| `pnpm dev` | `next dev` | Starts Next.js development server with hot reload |
| `pnpm build` | `next build` | Compiles optimized production bundle |
| `pnpm start` | `next start` | Runs the compiled production application |
| `pnpm lint` | `eslint "src/**/*.{ts,tsx}"` | Validates code style and Core Web Vitals rules |
| `pnpm typecheck` | `tsc --noEmit` | Executes strict TypeScript compilation verification |

### Backend Scripts (`backend/`)

| Script | Command | Purpose |
|---|---|---|
| `pnpm start:dev` | `nest start --watch` | Starts NestJS with live auto-rebuild on file change |
| `pnpm build` | `nest build` | Compiles TypeScript into the `dist/` directory |
| `pnpm start:prod` | `node dist/main` | Runs the production-compiled backend server |
| `pnpm typecheck` | `tsc --noEmit` | Strict type checking without emitting build files |
| `pnpm prisma:generate` | `prisma generate` | Generates TypeScript types from `prisma/schema.prisma` |
| `pnpm peers check` | `pnpm peers check` | Verifies clean peer dependency tree |

---

## 8. Verification & Acceptance Status

All 10 Project Initialization Milestones are complete and verified:

- [x] **Milestone 1**: Environment inspected (`Node v22.22.2`, `pnpm 11.0.9`, mutually compatible version matrix established).
- [x] **Milestone 2**: Clean project directory tree created; Git repository initialized with comprehensive `.gitignore`.
- [x] **Milestone 3**: Next.js 16 initialized with React 19, TypeScript 5, and App Router.
- [x] **Milestone 4**: Native ESLint 9 flat configuration (`eslint.config.mjs`) configured with zero peer warnings.
- [x] **Milestone 5**: Material UI (MUI) v7 integrated with Emotion SSR Registry (`useServerInsertedHTML`) and custom design theme.
- [x] **Milestone 6**: NestJS 12 initialized independently with TypeScript 6 decorator support.
- [x] **Milestone 7**: Configured global `ValidationPipe`, CORS, Swagger documentation (`/api/docs`), and health endpoint (`/api/health`).
- [x] **Milestone 8**: Prisma 6 ORM and PostgreSQL datasource configured with safe lifecycle handling in `PrismaService`.
- [x] **Milestone 9**: End-to-end integration verified: simultaneous server execution confirmed with live frontend-to-backend communication.
- [x] **Milestone 10**: Complete developer setup guide and architecture documented in `README.md`.
