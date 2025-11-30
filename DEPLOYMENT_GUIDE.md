# 🚀 Momentum AI - Complete Deployment Guide

## 📋 Table of Contents
1. [Local Testing](#local-testing)
2. [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
3. [Deploy Backend to Railway](#deploy-backend-to-railway)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Troubleshooting](#troubleshooting)

---

## 🧪 Local Testing

### Step 1: Install Frontend Dependencies

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npm install
```

This will install all required packages (React, Tailwind, Framer Motion, etc.)

### Step 2: Start Frontend Locally

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Open in browser:** http://localhost:3000

You should see the beautiful glassmorphic landing page! 🎨

### Step 3: Test Dark/Light Mode

1. Click the Moon/Sun icon in the navigation
2. Theme should toggle smoothly
3. Preference is saved to localStorage

### Step 4: Navigate Through Pages

Test all routes:
- `/` - Landing page
- `/dashboard` - Dashboard with stats
- `/assessment/STU001` - 10-question survey
- `/forecast/STU001` - Academic forecast
- `/student/STU001` - Student profile
- `/school-overview` - School analytics

All pages should load with mock data (no backend needed for frontend-only testing).

### Step 5: Test Backend (Optional)

```bash
# In a new terminal
cd /Users/saahilmardhekar/Desktop/momentum-ai/backend
python -m venv venv
source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Access:**
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs

---

## 🌐 Deploy Frontend to Vercel (Recommended - FREE)

Vercel is perfect for React apps and has a generous free tier.

### Method 1: Deploy from GitHub (Easiest)

1. **Go to [Vercel](https://vercel.com)**
2. Click **"Sign Up"** or **"Log In"** (use GitHub)
3. Click **"New Project"**
4. **Import** your repository: `saahilmard/momentum-ai`
5. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Environment Variables** (click "Add"):
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api/v1
   ```
   (Leave blank for now if backend not deployed yet)

7. Click **"Deploy"**

**⏱️ Deployment takes ~2 minutes**

**You'll get a URL like:**
```
https://momentum-ai-xyz.vercel.app
```

### Method 2: Deploy from CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: momentum-ai
# - Directory: ./
# - Build command: npm run build
# - Output directory: dist

# Deploy to production
vercel --prod
```

### Vercel Automatic Deployments

✅ Every `git push` to main branch will auto-deploy!
✅ Pull requests get preview URLs
✅ Free SSL certificate
✅ Global CDN

---

## 🚂 Deploy Backend to Railway (Recommended - FREE Tier)

Railway is perfect for Python/FastAPI apps.

### Step 1: Prepare Backend for Deployment

Create `railway.json` in backend folder:

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/backend
```

Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `runtime.txt`:
```
python-3.11.0
```

### Step 2: Deploy to Railway

1. **Go to [Railway](https://railway.app)**
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select **`saahilmard/momentum-ai`**
5. **Configure:**
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

6. **Environment Variables** (click "Variables"):
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=https://momentum-ai-xyz.vercel.app
   ```

7. Click **"Deploy"**

**You'll get a URL like:**
```
https://momentum-ai-production.up.railway.app
```

### Step 3: Connect Frontend to Backend

Update your Vercel environment variable:
```
VITE_API_URL = https://momentum-ai-production.up.railway.app/api/v1
```

Redeploy Vercel (automatic if you set env var in dashboard).

---

## 🔧 Environment Variables

### Frontend (.env)

Create `/Users/saahilmardhekar/Desktop/momentum-ai/frontend/.env`:

```env
# Development
VITE_API_URL=http://localhost:8000/api/v1

# Production (set in Vercel)
# VITE_API_URL=https://your-backend.railway.app/api/v1
```

### Backend (.env)

Create `/Users/saahilmardhekar/Desktop/momentum-ai/backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/momentum_ai

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production

# CORS (add your frontend URL)
CORS_ORIGINS=http://localhost:3000,https://momentum-ai-xyz.vercel.app

# Environment
ENVIRONMENT=production
```

---

## 🌍 Alternative Deployment Options

### Frontend Alternatives

| Platform | Free Tier | Auto-Deploy | Custom Domain |
|----------|-----------|-------------|---------------|
| **Vercel** ✅ | Yes | Yes | Yes |
| **Netlify** | Yes | Yes | Yes |
| **Cloudflare Pages** | Yes | Yes | Yes |
| **GitHub Pages** | Yes | Manual | Yes |

### Backend Alternatives

| Platform | Free Tier | Database | Custom Domain |
|----------|-----------|----------|---------------|
| **Railway** ✅ | $5 credit/month | PostgreSQL addon | Yes |
| **Render** | Yes (with sleep) | PostgreSQL | Yes |
| **Fly.io** | Yes (limited) | PostgreSQL | Yes |
| **Heroku** | No longer free | PostgreSQL | Yes |

---

## 🎯 Quick Deploy Commands

### Frontend to Vercel (One Command)

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npx vercel --prod
```

### Frontend to Netlify

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npm run build
npx netlify deploy --prod --dir=dist
```

### Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd /Users/saahilmardhekar/Desktop/momentum-ai
railway init
railway up
```

---

## 🌐 Custom Domain Setup

### For Vercel (Frontend)

1. Go to your Vercel project
2. Click **"Domains"**
3. Add your domain: `momentum-ai.com`
4. Follow DNS instructions (add CNAME or A record)
5. Wait ~1 hour for DNS propagation
6. Free SSL automatically applied! ✅

### For Railway (Backend)

1. Go to your Railway project
2. Click **"Settings"** → **"Domains"**
3. Add custom domain: `api.momentum-ai.com`
4. Add CNAME record to your DNS:
   ```
   api.momentum-ai.com CNAME momentum-ai-production.up.railway.app
   ```

---

## 📊 Deployment Checklist

### Pre-Deploy
- [ ] All code committed to GitHub
- [ ] Dependencies installed locally
- [ ] Local testing passed (frontend works)
- [ ] Environment variables documented
- [ ] .env files in .gitignore (don't commit secrets!)

### Frontend Deploy
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Live URL working

### Backend Deploy (Optional)
- [ ] Railway account created
- [ ] Project created from GitHub
- [ ] Root directory set to `backend`
- [ ] Environment variables set
- [ ] Database connected
- [ ] API endpoints working
- [ ] CORS configured for frontend URL

### Post-Deploy
- [ ] Test all pages on live URL
- [ ] Dark/light mode works
- [ ] Charts render correctly
- [ ] Mobile responsive
- [ ] Custom domain (optional)
- [ ] Analytics added (optional)

---

## 🐛 Troubleshooting

### Build Errors on Vercel

**Error:** `Cannot find module 'react'`
```bash
# Solution: Ensure package.json has all dependencies
npm install
git add package-lock.json
git commit -m "Add package-lock"
git push
```

**Error:** `VITE_API_URL is not defined`
```
# Solution: Add environment variable in Vercel dashboard
Settings → Environment Variables → Add
```

### Frontend Shows Blank Page

1. **Check browser console** (F12)
2. **Verify build output:**
   ```bash
   npm run build
   ls dist/  # Should have index.html and assets/
   ```
3. **Check Vercel logs:**
   - Go to Vercel project → Deployments → Latest → Logs

### API Calls Failing (CORS)

**Error:** `blocked by CORS policy`

**Solution:** Update backend CORS settings in `backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://momentum-ai-xyz.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Charts Not Rendering

**Error:** Charts show empty or broken

**Solution:** Recharts needs window object (SSR issue):
```typescript
// Wrap charts in client-only check
if (typeof window !== 'undefined') {
  // Render chart
}
```

Our implementation already handles this correctly.

---

## 📈 Performance Optimization

### Frontend

```bash
# Build for production (minified, optimized)
npm run build

# Analyze bundle size
npm install -D rollup-plugin-visualizer
```

### Enable Gzip Compression (Vercel)

Create `vercel.json` in frontend root:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🎉 Your Live URLs

Once deployed, you'll have:

**Frontend (Vercel):**
```
https://momentum-ai.vercel.app
```

**Backend (Railway - Optional):**
```
https://momentum-ai-production.up.railway.app
```

**Custom Domain (Optional):**
```
https://momentum-ai.com
https://api.momentum-ai.com
```

---

## 🆘 Need Help?

1. **Check Vercel Logs:** Deployments → [Your deployment] → Logs
2. **Check Browser Console:** F12 → Console tab
3. **Railway Logs:** Project → Deployments → Logs
4. **GitHub Issues:** Create issue in your repo

---

## 🎯 Quick Start Summary

**Fastest way to get online:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
vercel --prod

# 3. Done! You'll get a URL immediately.
```

**No backend needed** - Frontend works standalone with mock data!

---

**🎉 Your Momentum AI platform will be live in under 5 minutes!**
