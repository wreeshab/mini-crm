# Railway Deployment Guide

## Quick Start (5 minutes)

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Deploy on Railway
1. Go to https://railway.app
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose `wreeshab/mini-crm`
5. Railway auto-detects `Dockerfile` and starts building
6. Wait for "Live" status (~2 min)

### Step 3: Add Database
1. In your Railway project → **+ Add**
2. Select **Database** → **PostgreSQL**
3. Railway auto-creates `DATABASE_URL` env var
4. Done!

### Step 4: Add App Env Vars
In your service → **Variables**:
- `JWT_SECRET` - Any random string, e.g. `super-secret-key`
- `JWT_EXPIRES_IN` - `1h` (optional, has default)

### Step 5: Verify
```bash
# Get URL from Railway dashboard
curl https://mini-crm-prod-<random>.railway.app/api/docs

# Should return Swagger UI
```

## Auto-Deploy on Push
Every `git push origin main` auto-deploys. No extra config needed.

To disable: Railway dashboard → **Deploy** settings → Uncheck auto-deploy.

## Database Setup

### Option A: Railway-Hosted PostgreSQL (Easiest)
```
Project → + Add → Database → PostgreSQL
```
Railway auto-creates everything and sets `DATABASE_URL`.

### Option B: External Database (Neon/Supabase)
1. Create DB at https://neon.tech or https://supabase.com
2. Copy connection string
3. In Railway → Variables → Add `DATABASE_URL`
4. Paste connection string

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection (auto-set if using Railway DB)
- `JWT_SECRET` - Any random string

Optional:
- `JWT_EXPIRES_IN` - Token expiration (default: `1h`)
- `PORT` - Server port (default: `3000`)

## Logs & Debugging

Click **Logs** in your service:
- See real-time server output
- Check startup errors
- Monitor requests

## Pricing

- **Hobby tier (Free)**: $5/month credits
  - This app uses ~$2-3/month
  - You get free credits monthly
  
- **Pro tier ($20/month)**: Unlimited

## Common Issues

### "Build failed"
- Check logs for errors
- Verify Dockerfile builds locally: `docker build .`
- Ensure `.dockerignore` isn't excluding critical files

### "Health check failed / App crashes"
- Check logs for errors
- Verify `DATABASE_URL` is correct
- Ensure all env vars are set

### "Cannot connect to database"
- If using Railway DB: Wait 30 sec after creation
- If external DB: Verify connection string is correct
- Check DB is accepting public connections

## Monitoring

- **Service Health**: Shows CPU, memory, network
- **Logs**: Real-time output
- **Deployments**: View all past deployments
- **Metrics**: In Pro tier

## Custom Domain

1. Railway dashboard → Your service → **Settings**
2. Under **Domains** → **Add**
3. Enter your domain or subdomain
4. Update DNS records (Railway shows instructions)

## Next Steps

- Add CI/CD tests before deploy
- Set up error tracking (Sentry)
- Add custom domain
- Set up monitoring alerts

## Support

- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app
