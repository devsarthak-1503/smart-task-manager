# 🚀 Deployment Guide — Smart Task Manager (MERN)

This guide provides step-by-step instructions on deploying the Smart Task Manager application to **Vercel** (Frontend) and **Render** (Backend), with database connection handling for **MongoDB Atlas**.

---

## 🛠️ Environment Variables Setup

Ensure you create a `.env` file (copied from `.env.example`) in both frontend and backend directories with the appropriate values.

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Smart_TaskManager
JWT_SECRET=your_jwt_signing_key_secret_change_me_in_production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend Environment Variables (`frontend/.env`)
```env
VITE_API_URL=https://your-backend-app.onrender.com
```

---

## 📦 1. Deploying the Backend on Render

Render is ideal for deploying Node.js/Express web servers.

1. Create a free account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your Git repository containing the project.
4. Configure the Web Service settings:
   * **Name**: `smart-task-manager-api`
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. Click **Advanced** and add the required **Environment Variables** (listed above).
6. Click **Deploy Web Service**. Render will build and deploy your API gateway. Note the deployed URL (e.g., `https://smart-task-manager-api.onrender.com`).

---

## 🎨 2. Deploying the Frontend on Vercel

Vercel is the recommended hosting platform for Vite/React applications.

1. Sign up/log in to [Vercel](https://vercel.com/).
2. Click **Add New** and select **Project**.
3. Import your Git repository containing the project.
4. In the configuration window, select the **Root Directory** as `frontend`.
5. Select framework preset: **Vite**.
6. Expand **Environment Variables** and add:
   * **Key**: `VITE_API_URL`
   * **Value**: Your Render backend URL (e.g., `https://smart-task-manager-api.onrender.com`)
7. Click **Deploy**. Vercel will bundle your assets and host them.
8. Once deployed, note down your Vercel URL (e.g., `https://smart-task-manager.vercel.app`).
9. **Important**: Go back to your Render dashboard, edit the backend `FRONTEND_URL` environment variable to match this Vercel URL, and trigger a redeployment to ensure secure CORS handshakes!

---

## 🗄️ 3. MongoDB Atlas Configuration

If using a cloud database:

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and select **Add IP Address**.
   * For testing or Render hosting, allow access from anywhere (`0.0.0.0/0`) since Render uses dynamic IP addresses.
3. Go to **Database Access** and create a database user with read/write access.
4. Click **Connect**, select **Drivers**, and copy the connection string (`MONGO_URI`).
5. Update your backend `.env` variables on Render with this connection string.

---

## 🛡️ Database Resilience Feature (Offline Mode)

If the backend server fails to establish a connection to your MongoDB Atlas cluster (due to network drops, firewall blocks, or DNS resolution timeouts), it will **automatically fall back to local JSON database mode**.
* Tasks and user credentials will be securely saved under `backend/db_fallback.json` to keep the application 100% functional instead of crashing.
