# 🚀 Complete Deployment & Setup Guide for GD Public School

This guide explains step-by-step how to set up the database, media storage, and host the full-stack system:
- **Backend**: Node.js / Express deployed on **Render** (Free)
- **Frontend**: Next.js 14 / TypeScript / Tailwind deployed on **Vercel** (Free)
- **Database**: MongoDB Atlas (Free Cloud Cluster)
- **Media Storage**: Cloudinary (Free Cloud Image & Video Storage)

---

## 📋 Architecture Overview

```
 [Parents & Public Visitors]         [School Principal / Admin]
              │                                   │
              ▼                                   ▼
   Next.js Frontend (Vercel)          Admin Panel (/admin)
   https://gdpublicschool.vercel.app
              │
              │ REST API (Bearer JWT Auth for Admin)
              ▼
    Node.js Express Backend (Render)
    https://gdps-backend.onrender.com
              ├─── MongoDB Atlas (Persistent School Data & Settings)
              └─── Cloudinary (Logo, Staff Photos & Gallery Uploads)
```

---

## Step 1: Create Free MongoDB Atlas Database

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Click **Create a Deployment** and select the **M0 Free Tier**.
3. Choose your nearest cloud provider region (e.g. AWS Mumbai `ap-south-1`).
4. Under **Security Quickstart**:
   - Create a database user (e.g., username: `gdps_admin`, password: `YourStrongPassword123`).
   - Under **Network Access** / **IP Access List**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)** so Render can connect.
5. Click **Connect** > **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://gdps_admin:YourStrongPassword123@cluster0.xxxxx.mongodb.net/gdps?retryWrites=true&w=majority
   ```

---

## Step 2: Create Free Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com) and create a free account.
2. In the Cloudinary Dashboard, copy these 3 credentials:
   - **Cloud Name** (e.g. `dxyza123`)
   - **API Key** (e.g. `123456789012345`)
   - **API Secret** (e.g. `abcdefghijklmnopqrstuvw`)

---

## Step 3: Deploy Backend on Render

1. Push your repository to GitHub (or push the `backend` folder to a repository).
2. Go to [https://render.com](https://render.com) and log in with GitHub.
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Configure the Web Service:
   - **Name**: `gdps-backend` (or your preferred name)
   - **Root Directory**: `backend` (if in monorepo, else leave blank)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Add **Environment Variables** in Render dashboard:
   | Key | Value | Description |
   |---|---|---|
   | `MONGODB_URI` | `mongodb+srv://...` | Connection string from Step 1 |
   | `JWT_SECRET` | `gdps_jwt_secret_key_9988` | Any long random secret key |
   | `ADMIN_USERNAME` | `admin` | Your admin panel login username |
   | `ADMIN_PASSWORD` | `gdps2024` | Your admin panel login password |
   | `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | From Cloudinary |
   | `CLOUDINARY_API_KEY` | `your_api_key` | From Cloudinary |
   | `CLOUDINARY_API_SECRET` | `your_api_secret` | From Cloudinary |
   | `FRONTEND_URL` | `https://gdpublicschool.vercel.app` | Your Vercel frontend URL (from Step 4) |
   | `PORT` | `5000` | (Render auto-manages port) |
7. Click **Create Web Service**.
8. Once deployment completes, copy your Render backend URL:
   `https://gdps-backend.onrender.com`

---

## Step 4: Deploy Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** > **Project**.
3. Import your GitHub repository.
4. If your project is a monorepo, set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://gdps-backend.onrender.com` (Your Render URL) |
6. Click **Deploy**.
7. In ~60 seconds, your site is live with an SSL certificate (`https://gdpublicschool.vercel.app`)!

> **Note**: Update the `FRONTEND_URL` environment variable on Render with your final Vercel domain, and redeploy the backend so CORS is fully linked.

---

## 🛠️ How to Use the Admin Panel

1. Open your live website and click **Admin Panel** in the top navigation bar or go to `/admin`.
2. Login credentials:
   - **Username**: `admin`
   - **Password**: `gdps2024` (or your custom password set in Render)
3. **Sections available in Admin Panel**:
   - 👥 **Leadership & Staff**:
     - Pre-configured cards for **Director**, **Managing Director**, **Principal**, **Vice Principal**.
     - Photos and names are blank initially. Click **Upload Photo** to upload high-resolution staff pictures directly to Cloudinary.
     - Edit names, qualifications, and roles at any time.
     - Add new positions (e.g. Academic Coordinator, Sports Head).
   - 🖼️ **School Logo**:
     - Upload your official school logo. If blank, a default graduation emblem is shown.
   - 🏫 **School Info & Contact**:
     - Update address, contact numbers, email, CBSE board affiliation, and timings.
   - 📊 **Stats Counter**:
     - Customize student count (e.g. `1,500+`), teachers (`75+`), years (`16+`), and classes (`Nur to 12th`).
   - 📸 **Gallery & Media**:
     - Upload high-resolution campus photos and event pictures.
   - 📢 **Notice Board**:
     - Publish examination schedules, admission notices, or event circulars.

---

## 💻 Running Locally

### Backend:
```bash
cd backend
npm install
# Ensure .env is populated
npm run dev
# Server runs on http://localhost:5000
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
# Website runs on http://localhost:3000
# Admin panel runs on http://localhost:3000/admin
```
