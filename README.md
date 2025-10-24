# HireLoop

**AI-assisted recruiting workflow platform with ATS integration, candidate screening, outreach sequences, and analytics.**

## Overview

HireLoop is an end-to-end recruiting automation platform that helps teams streamline their hiring process from job posting to candidate scheduling. The platform includes:

- **ATS Integration** - Ingest jobs and applications from Greenhouse, Lever, and other platforms
- **AI-Powered Screening** - Automated candidate labeling with scoring and reasoning
- **Smart Outreach** - Compliant email sequences with quiet hours and rate limiting
- **Reply Classification** - Intelligent triage of candidate responses
- **Calendar Integration** - Automated scheduling with Google Calendar and Microsoft 365
- **Analytics Dashboard** - Real-time metrics and funnel reporting

## Architecture

This is a monorepo managed with **pnpm workspaces**:

```
hireloop/
├── apps/
│   ├── web/          # Next.js 14 frontend (TypeScript)
│   └── api/          # Express API (TypeScript)
├── packages/
│   └── common/       # Shared types and utilities
├── infra/
│   └── terraform/    # IaC for future AWS deployment
├── .github/
│   └── workflows/    # CI/CD workflows
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── SETUP_WIZARD.md   # Credentials intake guide
```

## Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **API**: Node.js 20, Express, TypeScript, Zod validation
- **Database**: PostgreSQL (Neon free tier)
- **Cache/Queue**: Redis (Upstash, optional)
- **Email**: Resend or Mailgun sandbox
- **Calendar**: Google Calendar API
- **Hosting**: Vercel (web), Render/Railway (API)
- **Monitoring**: Sentry (optional)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nitish0shr/hireloop.git
   cd hireloop
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up credentials**
   
   Follow the comprehensive setup guide in `SETUP_WIZARD.md` to configure:
   - Vercel project access
   - Render/Railway service access
   - Neon Postgres database
   - Email service (Resend/Mailgun)
   - Google Calendar API (optional)
   - Sentry DSN (optional)

4. **Configure environment variables**
   
   Create `.env.local` files in each workspace:
   
   **apps/web/.env.local**
   ```bash
   NEXT_PUBLIC_API_BASE=http://localhost:3001
   ```
   
   **apps/api/.env**
   ```bash
   DATABASE_URL=postgresql://...
   EMAIL_API_KEY=...
   EMAIL_FROM=noreply@yourdomain.com
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=...
   SENTRY_DSN=...
   NODE_ENV=development
   PORT=3001
   ```

### Development

**Run all workspaces in development mode:**
```bash
pnpm dev
```

**Run individual workspaces:**
```bash
# Web app (Next.js)
pnpm --filter @hireloop/web dev

# API server (Express)
pnpm --filter @hireloop/api dev

# Common package (type checking)
pnpm --filter @hireloop/common typecheck
```

**Type checking:**
```bash
pnpm typecheck
```

**Linting:**
```bash
pnpm lint
```

**Build:**
```bash
pnpm build
```

### Workspace Structure

#### `apps/web` - Next.js Web Application

- **Framework**: Next.js 14 with App Router
- **Port**: 3000
- **Features**: 
  - Dashboard with funnel metrics
  - Job management
  - Candidate review queue
  - Outreach sequence builder
  - Reply inbox and classification
  - Interview scheduling

#### `apps/api` - Express API Server

- **Framework**: Express.js with TypeScript
- **Port**: 3001
- **Features**:
  - RESTful API endpoints
  - Job and candidate management
  - Screening and scoring logic
  - Outreach sequence management
  - Reply classification
  - Calendar integration
  - Metrics and analytics

#### `packages/common` - Shared Types

- Shared TypeScript types and interfaces
- Used by both web and API workspaces
- Includes types for:
  - Job, Candidate, Application
  - Sequence, Message, Reply
  - Event, Consent, AuditLog
  - Rubric, Metrics, and more

## Verification Steps

### 1. Verify Monorepo Structure

```bash
# Check that all workspaces are recognized
pnpm -r list

# Should show:
# @hireloop/api
# @hireloop/common
# @hireloop/web
```

### 2. Verify TypeScript Configuration

```bash
# Type check all workspaces
pnpm typecheck

# Should complete without errors
```

### 3. Verify Shared Types

```bash
# Check that common package exports types
cat packages/common/src/index.ts

# Should show exported types:
# - Job, Candidate, Application
# - Sequence, Message, Reply, Event
# - Consent, AuditLog, FunnelMetrics
# - etc.
```

### 4. Verify Dependencies

```bash
# Check workspace dependencies
pnpm why @hireloop/common

# Should show both web and api depend on common
```

### 5. Verify Setup Documentation

```bash
# Check that setup wizard exists
cat SETUP_WIZARD.md

# Should contain:
# - Credentials checklist
# - Setup instructions for all services
# - Environment variable configuration
# - Verification steps
# - Troubleshooting guide
```

### 6. Verify Directory Structure

```bash
# List all workspace directories
find . -name "package.json" -not -path "*/node_modules/*"

# Should show:
# ./package.json
# ./apps/web/package.json
# ./apps/api/package.json
# ./packages/common/package.json
```

## Build Instructions

### Build All Workspaces

```bash
# Install dependencies
pnpm install

# Build all workspaces
pnpm build

# This will:
# 1. Build @hireloop/common (no-op, types only)
# 2. Build @hireloop/web (Next.js production build)
# 3. Build @hireloop/api (TypeScript compilation)
```

### Build Individual Workspaces

```bash
# Build web app
pnpm --filter @hireloop/web build

# Build API
pnpm --filter @hireloop/api build
```

### Production Deployment

1. **Deploy to Vercel (Web)**
   ```bash
   vercel --prod
   ```
   Or use GitHub Actions workflow for automatic deployment.

2. **Deploy to Render/Railway (API)**
   - Connect GitHub repository
   - Set build command: `pnpm install && pnpm --filter @hireloop/api build`
   - Set start command: `pnpm --filter @hireloop/api start`
   - Configure environment variables

3. **Database Migrations**
   ```bash
   # Run migrations (when Prisma is added)
   pnpm --filter @hireloop/api db:migrate
   ```

## Testing

Testing setup to be added in future PRs:
- Unit tests with Vitest
- Integration tests with Playwright
- API tests with Supertest

## CI/CD

GitHub Actions workflows to be added in future PRs:
- `.github/workflows/ci.yml` - Type checking, linting, testing
- `.github/workflows/deploy.yml` - Automated deployment

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run type checking and linting: `pnpm typecheck && pnpm lint`
4. Commit with a clear message
5. Push and create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For setup assistance or issues:
1. Check `SETUP_WIZARD.md` for credentials setup
2. Review this README for build and development instructions
3. Create an issue with detailed error messages and steps to reproduce

---

**Last Updated**: October 24, 2025
