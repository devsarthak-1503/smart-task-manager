# Smart Task Manager (MERN Stack)

A fully-featured, production-ready, secure MERN application built for managing daily tasks with robust JSON Web Token (JWT) authentication, protected routing, and advanced task sorting and metrics.

Featuring a **premium dark-themed vanilla CSS UI** and a **resilient database fallback layer**, the app runs flawlessly under any system conditions.

---

##  Deployment Links

- Frontend: https://smart-task-manager-roan.vercel.app/login
- Backend API: https://smart-task-manager-7iw0.onrender.com/

## Key Features

### 1. **Robust Authentication & Security**
* **User Accounts**: Clean registration with frontend and backend formatting checks, login, and secure session logout.
* **Password Hashing**: Salted secure hashes managed using `bcryptjs` (which avoids native Windows node-gyp build issues).
* **JWT Authorization**: Encrypted tokens with a 1-day expiration, auto-injected by Axios interceptors for protected routes.
* **Security Headers & Rate Limits**: Integrated `helmet` headers protection and rate-limiting limits for authentication endpoints to prevent brute-force attacks.

### 2. **Advanced Task Dashboard**
* **Metrics Tracker**: Live task completion rates displayed dynamically via progress bars.
* **Interactive checklist**: One-click checkbox completion state toggles using custom CSS visual checks.
* **Due Date & Urgency Warnings**: Set task deadlines via a calendar selector, with visual red highlights for overdue items.
* **Priority Levels**: Flag tasks as High (red border), Medium (orange border), or Low (blue border) for visual layout parsing.
* **Live Search & Filter Tabs**: Instant client-side title/description searching, combined with filter tabs (All, Active, Completed) and priority dropdown selectors.

### 3. **⚠️ Resilient JSON Database Fallback**
* **Offline Resiliency**: If your internet drops or your network DNS blocks connection to MongoDB Atlas, the server **will not crash**.
* It automatically redirects all model operations to a local file database stored at `backend/db_fallback.json` to keep the application 100% active and functional.

---

## Project Structure

```bash
smart-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js               # Database connection and event logger
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT validation gateway
│   ├── models/
│   │   ├── User.js             # User wrapper (Mongo/JSON dynamic switcher)
│   │   └── Task.js             # Task wrapper (Mongo/JSON dynamic switcher)
│   ├── routes/
│   │   ├── authRoutes.js       # Register and Login routes with validations
│   │   └── taskRoutes.js       # CRUD endpoints for personal tasks
│   ├── utils/
│   │   └── jsonDb.js           # Local database read/write fallback utility
│   ├── .env.example            # Environment variables configuration template
│   ├── app.js                  # Express middleware configuration
│   └── server.js               # Web server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js          # Central Axios client with token interceptor
│   │   │   └── authApi.js      # Auth requests handler
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Dynamic navigation navbar
│   │   │   ├── TaskForm.jsx    # Advanced form (Priority, description, date)
│   │   │   └── TaskList.jsx    # Styled task cards list
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth session state provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Interactive task layout and filters
│   │   │   ├── Login.jsx       # Login form with React Toastify
│   │   │   └── Register.jsx    # Register form with custom checks
│   │   ├── styles/
│   │   │   └── main.css        # Premium dark mode style sheets
│   │   ├── App.jsx             # React routing setup
│   │   └── main.jsx            # DOM mounting and provider wraps
│   ├── .env.example            # Vite environment template
│   ├── vercel.json             # Single-page-app rewrite rules
│   └── vite.config.js          # Vite config
│
├── DEPLOYMENT.md               # Step-by-step Render/Vercel guide
└── README.md                   # Project overview and run guides
```

---

## Running the App Locally

### 1. Configure Settings
Copy `.env.example` to `.env` in both folders and fill in your keys:
* **Backend**: Copy `backend/.env.example` -> `backend/.env`
* **Frontend**: Copy `frontend/.env.example` -> `frontend/.env` (or `.env.local`)

### 2. Launch Backend
```bash
cd backend
npm install
npm run dev
```
*Launches API gateway on port `http://localhost:5000`.*

### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
*Starts Vite development server on port `http://localhost:5173`.*

---

## Author
Sarthak Gaikwad
