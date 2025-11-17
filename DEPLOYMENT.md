# Deploying to Vercel

## Prerequisites
1. GitHub account (already done ✅)
2. Vercel account (sign up at vercel.com)
3. MySQL database for production

## Step 1: Set Up Production Database

You need a production MySQL database. Options:
- **PlanetScale** (Recommended - Free tier available)
- **Railway** (Free tier)
- **AWS RDS** (Paid)

### PlanetScale Setup (Recommended):
1. Go to https://planetscale.com
2. Sign up and create a new database
3. Get your connection details
4. Run the `sql/schema.sql` on your PlanetScale database

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your repository: `Ishikapathar/Online_Exam_Management`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`

5. Add Environment Variables:
   ```
   DB_HOST=your-planetscale-host
   DB_USER=your-planetscale-user
   DB_PASSWORD=your-planetscale-password
   DB_NAME=your-planetscale-db-name
   DB_PORT=3306
   ```

6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and set environment variables
```

## Step 3: Configure Backend for Production

The backend needs to be deployed separately or use Vercel Serverless Functions.

### For Serverless (Add to vercel.json):
The current `vercel.json` is configured for this.

### Environment Variables in Vercel:
Add these in Vercel Dashboard → Settings → Environment Variables:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`

## Step 4: Update Frontend API URL

In Vercel Dashboard, add:
```
VITE_API_URL=https://your-vercel-app.vercel.app/api
```

## Important Notes

⚠️ **For this project structure, you have two deployment options:**

### Option 1: Split Deployment (Recommended)
- Deploy frontend to Vercel
- Deploy backend to Railway/Render/Heroku
- Update `VITE_API_URL` to point to backend URL

### Option 2: Monorepo (Current setup)
- Deploy everything to Vercel
- Backend runs as serverless functions
- Database must be remote (PlanetScale, etc.)

## After Deployment

1. Test all features on your Vercel URL
2. Check browser console for any API errors
3. Verify database connectivity
4. Update README with live demo link

## Troubleshooting

- **CORS errors**: Update backend CORS settings to allow your Vercel domain
- **Database connection fails**: Check environment variables
- **Build fails**: Verify all dependencies in package.json
- **API not working**: Check if backend is properly deployed

## Your Project URLs
- GitHub: https://github.com/Ishikapathar/Online_Exam_Management
- Vercel: https://online-exam-management-[your-id].vercel.app (after deployment)
