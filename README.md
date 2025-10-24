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
│   └── terraform/    # IaC for AWS deployment
├── .github/
│   └── workflows/    # CI/CD workflows
├── pnpm-workspace.yaml
└── package.json
```

## Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **API**: Node.js 20, Express, TypeScript
- **Database**: PostgreSQL (Neon)
- **Cache/Queue**: Redis (Upstash)
- **Email**: Resend or Mailgun
- **Calendar**: Google Calendar API, Microsoft Graph API
- **Deployment**: Vercel (web), Render/Railway (API)

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development servers
pnpm dev
```

### Environment Setup

See individual app READMEs for required environment variables:

- `apps/web/README.md` - Frontend configuration
- `apps/api/README.md` - Backend configuration

## Development

```bash
# Run type checking across all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Clean build artifacts
pnpm clean
```

## Compliance

- **Consent Management** - Track user consent and preferences
- **Opt-Out Support** - One-click unsubscribe from sequences
- **Audit Logging** - Complete activity trail for all operations
- **PII Protection** - Email/phone hashing at rest
- **GDPR/CCPA Ready** - Data export and deletion endpoints

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see CONTRIBUTING.md for guidelines.
