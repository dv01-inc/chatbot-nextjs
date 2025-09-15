# Docker Setup Guide

This guide covers the various ways to run the chatbot-nextjs application using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- For Cloud SQL: Google Cloud CLI authenticated (`gcloud auth login` and `gcloud auth application-default login`)

## Available Compose Files

| File | Purpose | Database | Features |
|------|---------|----------|----------|
| `docker/compose.yml` | Basic production setup | Local PostgreSQL | Standard deployment |
| `docker/compose.cloud-sql.yml` | Cloud SQL production | Google Cloud SQL | IAM auth, cloud proxy |
| `docker/compose.dev.yml` | Development override | Any | Hot reload, volume mounts |

## Startup Options

### 1. Local Development (Recommended for Development)

**Quick start with local PostgreSQL:**
```bash
cd /Users/lukeamy/Documents/GitHub/chat-mcp-workspace/apps/chatbot-nextjs

# Start with local PostgreSQL and development features
docker-compose -f docker/compose.yml -f docker/compose.dev.yml up -d --build
```

**Features:**
- ✅ **Hot reload**: See code changes immediately
- ✅ **Volume mounts**: Local files mounted into container
- ✅ **Fast iteration**: No rebuild needed for code changes
- ✅ **Local database**: No Cloud SQL dependencies

**To see changes:**
- Just save your files - changes appear immediately
- No need to rebuild containers

---

### 2. Production Build with Local PostgreSQL

**Standard production setup:**
```bash
cd /Users/lukeamy/Documents/GitHub/chat-mcp-workspace/apps/chatbot-nextjs

# Start with local PostgreSQL
docker-compose -f docker/compose.yml up -d --build
```

**Features:**
- 🏗️ **Production build**: Optimized Next.js build
- 🐘 **Local PostgreSQL**: containerized database
- 🔄 **Rebuild required**: Changes need `--build` flag

**To see changes:**
```bash
# After making code changes
docker-compose -f docker/compose.yml up -d --build
```

---

### 3. Cloud SQL Production

**With environment variable:**
```bash
cd /Users/lukeamy/Documents/GitHub/chat-mcp-workspace/apps/chatbot-nextjs

# Replace with your actual Cloud SQL instance
CLOUD_SQL_INSTANCE=your-project:region:instance docker-compose -f docker/compose.cloud-sql.yml up -d --build
```

**With .env file:**
Add to `docker/.env`:
```bash
CLOUD_SQL_INSTANCE=your-project:region:instance
```

Then run:
```bash
docker-compose -f docker/compose.cloud-sql.yml up -d --build
```

**Features:**
- ☁️ **Google Cloud SQL**: Production database
- 🔐 **IAM Authentication**: Secure connection
- 🛡️ **Cloud SQL Proxy**: Encrypted tunnel
- 📊 **Health checks**: Ensures proxy is ready

---

### 4. Cloud SQL Development (Best of Both Worlds)

**Hot reload with Cloud SQL:**
```bash
cd /Users/lukeamy/Documents/GitHub/chat-mcp-workspace/apps/chatbot-nextjs

# Development mode with Cloud SQL
CLOUD_SQL_INSTANCE=your-project:region:instance docker-compose \
  -f docker/compose.cloud-sql.yml \
  -f docker/compose.dev.yml \
  up -d --build
```

**Features:**
- ✅ **Hot reload**: Immediate code changes
- ☁️ **Cloud SQL**: Production-like database
- 🔄 **No rebuilds**: for code changes

---

## Environment Variables

### Required for Cloud SQL
```bash
# In docker/.env
CLOUD_SQL_INSTANCE=your-project:region:instance-name
DATABASE_URL=postgresql://username:password@cloud-sql-proxy:5432/database_name

# Or for IAM authentication
DATABASE_URL=postgresql://username@cloud-sql-proxy:5432/database_name?sslmode=require
```

### Authentication Shell (Production)
```bash
# In docker/.env
NEXT_PUBLIC_AUTH_SHELL_URL=https://dev-static.dv01.cloud/dv01-shell/v0.30.1/auth.esm.js
```

### Gateway Configuration
```bash
# In docker/.env
UPSTREAM_SERVICE_URL=http://better-chatbot:3000
PROXY_SERVER_PORT=3002
PROXY_PATH=/chatbot
API_GATEWAY_URL=https://api-gateway.dv01.cloud
```

## Troubleshooting

### "Can't see my code changes"
- **Problem**: Using production compose files
- **Solution**: Use development override: `-f docker/compose.dev.yml`

### "Redirected to /sign-in page"
- **Problem**: AuthShell web component not loading
- **Solutions**:
  1. Check `NEXT_PUBLIC_AUTH_SHELL_URL` is accessible
  2. For development, AuthShell is bypassed automatically
  3. Verify browser console for script loading errors

### "Cloud SQL connection failed"
- **Problem**: Authentication or instance name issues
- **Solutions**:
  1. Run `gcloud auth application-default login`
  2. Verify `CLOUD_SQL_INSTANCE` format: `project:region:instance`
  3. Check Cloud SQL instance is running and accessible

### "Build taking too long"
- **Problem**: Full rebuild on every change
- **Solution**: Use development mode with volume mounts

## Useful Commands

```bash
# View logs
docker-compose logs -f better-chatbot

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build better-chatbot

# Check service status
docker-compose ps

# Remove volumes (fresh database)
docker-compose down -v
```

## Port Access

| Service | Port | Purpose |
|---------|------|---------|
| Next.js App | 3000 | Main application |
| localhost-helper | 3002 | Authentication gateway |
| PostgreSQL | 5432 | Database (local setup) |
| Cloud SQL Proxy | 5432 | Database (Cloud SQL setup) |

Access the application at: http://localhost:3000