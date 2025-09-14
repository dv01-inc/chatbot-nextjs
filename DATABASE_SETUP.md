# Database Setup Guide

This guide explains how to set up the database for the chatbot-nextjs project. You have two options:

1. **Local PostgreSQL** (using Docker)
2. **Google Cloud SQL** (using Cloud SQL Proxy sidecar)

## Option 1: Local PostgreSQL (Default)

This is the default setup using a local PostgreSQL database in Docker, with the localhost-helper gateway proxy.

### Prerequisites
- Docker and Docker Compose installed

### Setup
1. Use the default docker-compose file:
   ```bash
   docker-compose -f docker/compose.yml up -d
   ```

2. This will start:
   - **PostgreSQL Database**: `chatbot_db` on port `5432`
   - **Chatbot Application**: Available at `http://localhost:3000`
   - **Localhost Helper**: Gateway proxy at `http://localhost:3002`

3. The database will be automatically created with:
   - Database: `chatbot_db`
   - User: `chatbot`
   - Password: `password`
   - Port: `5432`

### Environment Variables
The project uses `docker/.env` with these settings:
```env
# Database
POSTGRES_URL=postgres://chatbot:password@postgres:5432/chatbot_db
POSTGRES_DB=chatbot_db
POSTGRES_USER=chatbot
POSTGRES_PASSWORD=password

# Gateway Proxy
UPSTREAM_SERVICE_URL=http://better-chatbot:3000
PROXY_SERVER_PORT=3002
PROXY_PATH=/chatbot
API_GATEWAY_URL=https://api-gateway.dv01.cloud
DEV_USERNAME=your_username@domain.com
DEV_PASSWORD=your_password

# Frontend API Gateway URL (for fetchWithAuth)
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3002
```

## Option 2: Google Cloud SQL

This setup connects to a Cloud SQL PostgreSQL instance using the Cloud SQL Proxy sidecar pattern, similar to the chat-next-js project.

### Prerequisites
- Google Cloud account with access to the Cloud SQL instance
- Docker and Docker Compose installed
- Your machine authenticated with Google Cloud (via `gcloud auth login` or service account key)

### Setup

1. **Configure environment variables**:
   Copy and modify the Cloud SQL environment file:
   ```bash
   cp docker/.env.cloud-sql docker/.env.cloud-sql.local
   ```

2. **Update the configuration**:
   Edit `docker/.env.cloud-sql.local` with your values:
   ```env
   USE_CLOUD_SQL=1
   CLOUD_SQL_INSTANCE=your-project:region:instance-name
   POSTGRES_IAM_USER=your-gcp-email@domain.com
   POSTGRES_DB=your-database-name
   ```

3. **Start with Cloud SQL proxy**:
   ```bash
   docker-compose -f docker/compose.cloud-sql.yml --env-file docker/.env.cloud-sql.local up -d
   ```

### How It Works

The Cloud SQL setup uses a sidecar container pattern:

- **Cloud SQL Proxy Container**: Handles the secure connection to Google Cloud SQL
  - Uses IAM authentication (`--auto-iam-authn`)
  - Connects to private IP (`--private-ip`)
  - Exposes PostgreSQL on port 5432

- **Application Container**: Connects to the proxy as if it were a local database
  - Uses the IAM connection utility (`src/lib/db/pg/iam-connection.ts`)
  - Connects to `localhost:5432` (the proxy)

### Authentication

The Cloud SQL Proxy uses IAM authentication, which means:
- No database passwords required
- Uses your GCP credentials (from `gcloud auth` or service account)
- The `POSTGRES_IAM_USER` must have Cloud SQL Client role

### Testing Without GCP Authentication

If you want to test the docker-compose setup without GCP authentication, you can:

1. **Use local PostgreSQL with the Cloud SQL compose file**:
   ```bash
   # Modify docker/.env.cloud-sql.local
   USE_CLOUD_SQL=0
   POSTGRES_URL=postgres://chatbot:password@localhost:5432/chatbot_db

   # Start a local PostgreSQL container manually
   docker run -d --name test-postgres \
     -e POSTGRES_DB=chatbot_db \
     -e POSTGRES_USER=chatbot \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     postgres:17

   # Then start the application
   docker-compose -f docker/compose.cloud-sql.yml --env-file docker/.env.cloud-sql.local up -d better-chatbot
   ```

## Switching Between Setups

### From Local to Cloud SQL
```bash
# Stop local setup
docker-compose -f docker/compose.yml down -v

# Start Cloud SQL setup
docker-compose -f docker/compose.cloud-sql.yml --env-file docker/.env.cloud-sql.local up -d
```

### From Cloud SQL to Local
```bash
# Stop Cloud SQL setup
docker-compose -f docker/compose.cloud-sql.yml down

# Start local setup
docker-compose -f docker/compose.yml up -d
```

## Troubleshooting

### Cloud SQL Connection Issues
- Ensure your GCP credentials are set up: `gcloud auth list`
- Verify the Cloud SQL instance name format: `project:region:instance`
- Check that your user has the Cloud SQL Client role
- Verify the database exists and your user has access

### Local Database Issues
- Check that Docker is running
- Verify port 5432 is not already in use: `lsof -i :5432`
- Check container logs: `docker logs docker-postgres-1`

### General Database Connection Issues
- Verify environment variables are loaded correctly
- Check application logs: `docker logs docker-better-chatbot-1`
- Ensure database migrations complete successfully