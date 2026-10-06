# 🚀 GD Public School - Production Hosting Guide

Your project is now published on GitHub:
👉 **Repository URL:** [https://github.com/anshkumar258090-alt/gd-public-school](https://github.com/anshkumar258090-alt/gd-public-school)

---

## 🌐 Step 1: Host Frontend on Vercel (Free & Instant)

1. Open **[https://vercel.com/new](https://vercel.com/new)** in your browser.
2. Sign in with GitHub (`anshkumar258090-alt`).
3. Click **"Import"** next to **`gd-public-school`**.
4. Configure the project:
   - **Framework Preset:** Next.js (Default)
   - **Root Directory:** Click *Edit* and select **`frontend`**
   - **Build Command:** `next build` (Default)
   - **Output Directory:** `.next` (Default)
5. Under **Environment Variables**, add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-backend-app.onrender.com` *(Render backend URL from Step 2)*
6. Click **Deploy**!
   - Within 60 seconds, your website will be live with a free SSL domain (e.g. `https://gd-public-school.vercel.app`).

---

## ⚡ Step 2: Host Backend on Render (Free Node.js Service)

1. Open **[https://dashboard.render.com](https://dashboard.render.com)**.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository **`anshkumar258090-alt/gd-public-school`**.
4. Configure settings:
   - **Name:** `gdps-backend`
   - **Region:** Singapore / Frankfurt / Oregon (any)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Click **Advanced** → **Add Environment Variable**:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Render default port |
   | `JWT_SECRET` | `gdps_super_secret_jwt_2025` | Security token secret |
   | `ADMIN_USERNAME` | `admin` | Admin dashboard username |
   | `ADMIN_PASSWORD` | `gdps2024` | Admin dashboard password |
   | `FRONTEND_URL` | `https://your-vercel-domain.vercel.app` | Vercel domain from Step 1 |
   | `MONGODB_URI` | *mongodb+srv://...* | *(Optional: MongoDB Atlas free cluster)* |
   | `CLOUDINARY_CLOUD_NAME` | *your_cloud_name* | *(Optional: Cloudinary storage)* |
   | `CLOUDINARY_API_KEY` | *your_api_key* | *(Optional)* |
   | `CLOUDINARY_API_SECRET` | *your_api_secret* | *(Optional)* |
6. Click **Create Web Service**.
   - Render will build and deploy your backend at `https://gdps-backend.onrender.com`.

---

## 🔗 Step 3: Link Them Together

1. Once Render finishes deploying, copy your backend URL:
   `https://gdps-backend-xxxx.onrender.com`
2. Go to your **Vercel Dashboard** → your project → **Settings** → **Environment Variables**.
3. Update `NEXT_PUBLIC_API_URL` with your Render backend URL.
4. Click **Redeploy** on Vercel.

**Done!** Your school website and admin panel are now permanently hosted live on the internet! 🎉
