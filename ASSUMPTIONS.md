## Assumptions for Initial Backend Scaffold  
  
1. There is no existing backend; we are free to scaffold a new Express-based service under `apps/backend`.  
2. Database credentials and external service keys (Supabase, S3, email, calendar, OpenAI, etc.) are not provided. We therefore return stubbed responses that match the OpenAPI contracts. The `.env.sample` lists the variables required once those services are configured.  
3. The monorepo already uses `pnpm` workspaces (`apps/*` and `packages/*`), so adding `apps/backend` automatically brings it into the workspace without modifying `pnpm-workspace.yaml`.  
4. TypeScript is used for backend development; compiled output goes to `dist/` and is run via Node. `ts-node-dev` is used for local development.  
5. Quality gates such as linting and accessibility are not configured yet; this scaffold simply compiles and runs. Future work should add ESLint, Prettier, tests and security checks.
