## Mini CRM API

A small CRM backend built with NestJS and Prisma. It supports JWT-based authentication, role-based users (admin/employee), customer management with search and pagination, and task assignment/status updates. Docker and Render configs are included for deployment, plus a Postman collection for quick testing.

## Tech Stack
- NestJS, TypeScript
- Prisma ORM with PostgreSQL
- JWT auth, role guards (admin/employee)
- Swagger for API docs

## Prerequisites
- Node.js 22+ and npm
- PostgreSQL (local or hosted). A docker-compose file is provided for local DB/pgAdmin.

## Getting Started
1) Clone the repo
```bash
git clone https://github.com/wreeshab/mini-crm.git
cd mini-crm
```
2) Install dependencies
```bash
npm install
```
3) Copy env template and fill values
```bash
cp .env.example .env
```
4) Make sure PostgreSQL is running and the DATABASE_URL points to it. For local Docker:
```bash
docker compose up -d postgres
```

## Environment Variables (.env)
See `.env.example` for the full list. Core values:
- DATABASE_URL – e.g. postgresql://crm_user:crm_pass@localhost:5432/crm_db?schema=public
- JWT_SECRET – any strong secret for signing tokens
- PORT – optional (defaults to 3000)

## Database Migrations (Prisma)
Run migrations after setting up env and DB:
```bash
npx prisma migrate deploy    # apply existing migrations
# or during local dev
npx prisma migrate dev --name init
```
If you need the Prisma client regenerated (usually automatic in scripts):
```bash
npx prisma generate
```

## Running the Server
- Development (watch mode):
```bash
npm run start:dev
```
- Production build and run:
```bash
npm run build
npm run start:prod
```
The API prefix is /api. Swagger is served at http://localhost:3000/api/docs (or the port you set).

## Swagger
Open the docs at: http://localhost:3000/api/docs
Bearer auth is configured under the access-token scheme.

## Postman Collection / cURL
- Postman collection: mini-crm.postman_collection.json (import into Postman). It covers auth, users, customers, and tasks.
- Example cURL: login to get a token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```
Use the returned JWT as Authorization: Bearer <token> for protected endpoints.

## Testing
```bash
npm test
```

## Docker / Deployment
- Local DB only: docker compose up -d postgres (pgAdmin exposed at 5050).
- Build API image:
```bash
docker build -t mini-crm-api .
docker run --env-file .env -p 3000:3000 mini-crm-api
```

## Deploy to Railway

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Deploy on Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select `wreeshab/mini-crm`
5. Railway auto-detects Docker and starts building

### Step 3: Add Environment Variables
In Railway dashboard → Your service → **Variables**:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Any secure random string

### Step 4: PostgreSQL Database
Railway can host your database too:
1. In Railway project → **+ Add** → **Database** → **PostgreSQL**
2. Railway auto-populates `DATABASE_URL`
3. Done! Database is ready.

### Verify Deployment
```bash
# Get your Railway URL from dashboard
curl https://mini-crm-prod-<random>.railway.app/api/docs
```

See [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md) for detailed guide.

**Free tier:** $5/month credits (covers this app easily)
