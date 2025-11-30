# ⚡ Momentum AI - Quick Start Guide

## 🎯 Get Your Website Live in 3 Steps

### Step 1: Test Locally (2 minutes)

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npm install
npm run dev
```

**Open:** http://localhost:3000

You should see your beautiful glassmorphic landing page! ✨

### Step 2: Deploy to Vercel (3 minutes)

**Option A: Deploy from Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import `saahilmard/momentum-ai`
4. Set **Root Directory:** `frontend`
5. Click "Deploy"

**Done! You'll get a live URL instantly** 🚀

**Option B: Deploy from Terminal**

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npx vercel --prod
```

Follow prompts → Get your URL!

### Step 3: Share Your URL 🎉

Your website will be live at:
```
https://momentum-ai-[random].vercel.app
```

or with custom domain:
```
https://your-domain.com
```

---

## 🎨 What You Get

✅ **6 Beautiful Pages:**
- Landing page with hero section
- Dashboard with analytics
- Interactive 10-question survey
- Academic forecasting with charts
- Student profile with metrics
- School overview

✅ **Features:**
- Dark/Light mode toggle
- Glassmorphism design
- Smooth animations
- Interactive charts
- Fully responsive

---

## 🐛 Troubleshooting

### "Command not found: npm"
Install Node.js from [nodejs.org](https://nodejs.org)

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Build fails on Vercel
Check the deployment logs in Vercel dashboard

---

## 📚 Full Documentation

- **Local Setup:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#local-testing)
- **Vercel Deploy:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#deploy-frontend-to-vercel)
- **Custom Domain:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#custom-domain-setup)
- **Frontend Guide:** [frontend/FRONTEND_SETUP.md](./frontend/FRONTEND_SETUP.md)

---

## 🎯 Your Live Website

After deploying, you'll have:

✅ Professional portfolio piece
✅ Live demo to share
✅ Resume/LinkedIn showcase
✅ Fully functional web app

**Ready? Let's go! 🚀**

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npm install && npm run dev
```
