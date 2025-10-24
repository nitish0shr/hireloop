# Hireloop Setup Wizard

Welcome to Hireloop! This guide will help you set up all required credentials and integrations for the platform.

## Overview

Hireloop requires several external services and credentials to operate. This document provides a checklist and instructions for setting up each integration.

## Prerequisites

- GitHub repository admin access (already granted)
- Access to your organization's infrastructure platforms (Vercel, Render/Railway, Neon)
- Email service account (Resend or Mailgun sandbox)
- Google Workspace account for Calendar API (optional)
- Sentry account for error tracking (optional)

## Credentials Checklist

Use this checklist to track your setup progress:

### Required Credentials

- [ ] **GitHub Repository Access** ✓ (Already configured)
- [ ] **Vercel Project Access**
  - Project ID
  - Team ID (if applicable)
  - Deploy token
- [ ] **Render/Railway Service Access**
  - Service name
  - API key
  - Deploy hook URL
- [ ] **Neon Postgres Database**
  - Connection string (DATABASE_URL)
  - Database name
  - Region
- [ ] **Email Service (Resend or Mailgun Sandbox)**
  - API key
  - Sender domain (verified)
  - Sandbox mode enabled
- [ ] **Google Calendar API** (Optional but recommended)
  - OAuth 2.0 Client ID
  - OAuth 2.0 Client Secret
  - Test user email
  - Redirect URI

### Optional Credentials

- [ ] **Sentry Error Tracking**
  - DSN (Data Source Name)
  - Project slug
  - Organization slug
- [ ] **Upstash Redis** (Optional - for queue/cache)
  - REST URL
  - REST Token

---

## Setup Instructions

### 1. Vercel Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or connect to existing
3. Link to your GitHub repository: `nitish0shr/hireloop`
4. Configure environment variables:
   ```
   NEXT_PUBLIC_API_BASE=<your-api-url>
   ```
5. Get your deploy token:
   - Settings → Tokens → Create Token
6. Note your Project ID (found in Settings → General)

### 2. Render/Railway Setup (API Backend)

#### Option A: Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Create a new Web Service
3. Connect to GitHub repository
4. Configure:
   - Build Command: `pnpm install && pnpm --filter @hireloop/api build`
   - Start Command: `pnpm --filter @hireloop/api start`
5. Add environment variables (see section below)

#### Option B: Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Create a new project
3. Connect to GitHub repository
4. Configure build settings
5. Add environment variables (see section below)

### 3. Neon Postgres Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project: `hireloop-db`
3. Create a database: `hireloop`
4. Copy the connection string (DATABASE_URL)
5. Enable pooling if needed
6. Note the connection parameters:
   ```
   DATABASE_URL=postgresql://user:password@host/hireloop?sslmode=require
   ```

### 4. Email Service Setup

#### Option A: Resend (Recommended)

1. Go to [Resend Dashboard](https://resend.com/)
2. Create an account or sign in
3. Add and verify your sender domain
4. Create an API key:
   - Settings → API Keys → Create API Key
5. Note your API key:
   ```
   EMAIL_API_KEY=re_...
   EMAIL_FROM=noreply@yourdomain.com
   ```

#### Option B: Mailgun Sandbox

1. Go to [Mailgun Dashboard](https://app.mailgun.com/)
2. Navigate to Sending → Domains
3. Use the sandbox domain provided
4. Get your API key from Settings → API Keys
5. Add authorized recipients (sandbox limitation)
6. Note your credentials:
   ```
   MAILGUN_API_KEY=key-...
   MAILGUN_DOMAIN=sandboxXXX.mailgun.org
   ```

### 5. Google Calendar API (Optional)

This enables automatic calendar event creation for interviews.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: `hireloop-calendar`
3. Enable Google Calendar API:
   - APIs & Services → Enable APIs and Services
   - Search for "Google Calendar API" and enable it
4. Create OAuth 2.0 credentials:
   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://your-api-domain.com/v1/auth/google/callback`
5. Add test users (while in development mode):
   - OAuth consent screen → Test users → Add users
6. Note your credentials:
   ```
   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxx
   GOOGLE_REDIRECT_URI=https://your-api-domain.com/v1/auth/google/callback
   ```

### 6. Sentry Error Tracking (Optional)

1. Go to [Sentry Dashboard](https://sentry.io/)
2. Create a new project
3. Select platform: Node.js / Next.js
4. Copy the DSN provided
5. Note your credentials:
   ```
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```

---

## Environment Variables Configuration

### GitHub Actions Secrets

Store all secrets in GitHub repository:

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each of the following:

```bash
# Database
DATABASE_URL=postgresql://...

# Email Service
EMAIL_API_KEY=...
EMAIL_FROM=noreply@yourdomain.com

# Google Calendar (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

# Sentry (optional)
SENTRY_DSN=...

# Deployment
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
RENDER_API_KEY=...  # or RAILWAY_TOKEN
```

### Vercel Environment Variables

In your Vercel project settings, add:

```bash
NEXT_PUBLIC_API_BASE=https://your-api.render.com
```

### Render/Railway Environment Variables

In your Render/Railway service settings, add:

```bash
# Database
DATABASE_URL=postgresql://...

# Email
EMAIL_API_KEY=...
EMAIL_FROM=...

# Google Calendar (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

# Sentry (optional)
SENTRY_DSN=...

# Application
NODE_ENV=production
PORT=3001
```

---

## Verification Steps

After setting up all credentials:

1. **Test Database Connection**
   ```bash
   pnpm --filter @hireloop/api dev
   # Should connect successfully
   ```

2. **Test Email Sending**
   - Send a test email through the API
   - Check delivery in sandbox/test mode

3. **Test Google Calendar** (if configured)
   - Create a test event
   - Verify it appears in Google Calendar

4. **Run CI/CD Pipeline**
   - Push to a branch
   - Verify GitHub Actions workflow succeeds
   - Check deployment to Vercel and Render/Railway

5. **Access Health Endpoints**
   - Web: `https://your-app.vercel.app`
   - API: `https://your-api.render.com/health`
   - Should return: `{ "ok": true }`

---

## Troubleshooting

### Database Connection Issues
- Verify the DATABASE_URL format
- Check if SSL mode is required: `?sslmode=require`
- Ensure your IP is not blocked by Neon

### Email Delivery Issues
- Verify sender domain is verified (Resend)
- Check sandbox authorized recipients (Mailgun)
- Review API key permissions

### Google Calendar Issues
- Ensure Calendar API is enabled
- Verify OAuth consent screen is configured
- Check test users are added
- Confirm redirect URI matches exactly

### Deployment Issues
- Check environment variables are set
- Verify build commands are correct
- Review deployment logs
- Ensure secrets are properly configured

---

## Security Best Practices

1. **Never commit credentials to git**
   - Always use environment variables
   - Add `.env` to `.gitignore`

2. **Rotate credentials regularly**
   - Update API keys every 90 days
   - Document rotation procedures

3. **Use principle of least privilege**
   - Grant minimal required permissions
   - Use read-only keys where possible

4. **Enable audit logging**
   - Monitor credential usage
   - Set up alerts for suspicious activity

5. **Backup credentials securely**
   - Use a password manager
   - Document recovery procedures

---

## Next Steps

Once you've completed this setup wizard:

1. ✅ Create a GitHub Issue using the checklist above
2. ✅ Complete the credential setup for each service
3. ✅ Add all secrets to GitHub Actions
4. ✅ Configure environment variables on target platforms
5. ✅ Run verification tests
6. ✅ Deploy the application
7. ✅ Review the main README for development instructions

---

## Support

If you encounter issues during setup:

1. Check the troubleshooting section above
2. Review service-specific documentation
3. Check GitHub Issues for similar problems
4. Create a new issue with:
   - Service name
   - Error message
   - Steps taken
   - Environment details

---

**Last Updated:** October 24, 2025
