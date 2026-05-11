# 📝 Personal Blog — Complete Setup Guide

A full-stack blog system with Node.js backend and a beautiful editorial frontend.

---

## 🗂️ Project Structure

```
personal-blog/
├── backend/
│   ├── server.js              ← Main entry point
│   ├── package.json           ← Dependencies
│   ├── middleware/
│   │   ├── auth.js            ← JWT authentication
│   │   └── dataStore.js       ← JSON file-based database
│   ├── routes/
│   │   ├── articles.js        ← Article CRUD API
│   │   ├── auth.js            ← Login / profile API
│   │   └── upload.js          ← Image upload API
│   ├── data/                  ← Auto-created: stores JSON data
│   └── uploads/               ← Auto-created: stores uploaded images
└── frontend/
    └── public/
        ├── index.html         ← Public blog homepage
        ├── article.html       ← Single article page
        ├── login.html         ← Admin login
        ├── admin.html         ← Admin dashboard
        └── editor.html        ← Article editor (Markdown)
```

---

## ✅ Prerequisites

Before starting, make sure you have these installed on your computer:

### 1. Install Node.js

- Go to **https://nodejs.org**
- Download the **LTS version** (recommended)
- Run the installer — it also installs **npm** automatically
- Verify installation by opening a terminal and typing:

```bash
node --version
# Should print something like: v20.10.0

npm --version
# Should print something like: 10.2.3
```

### 2. Install VS Code

- Go to **https://code.visualstudio.com**
- Download and install for your operating system

### 3. Recommended VS Code Extensions

Open VS Code → Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac) → Search and install:

| Extension | Purpose |
|-----------|---------|
| **REST Client** | Test API endpoints directly in VS Code |
| **Prettier** | Auto-format your code |
| **JavaScript (ES6) code snippets** | Code shortcuts |
| **Node.js Extension Pack** | Node.js tools bundle |

---

## 🚀 Step-by-Step Setup

### Step 1: Open the Project in VS Code

1. Open **VS Code**
2. Go to **File → Open Folder**
3. Select the `personal-blog` folder
4. VS Code will load the project

### Step 2: Open the Integrated Terminal

In VS Code:
- Press `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (Mac)
- OR go to **Terminal → New Terminal** from the menu bar

A terminal panel will open at the bottom of VS Code.

### Step 3: Navigate to the Backend Folder

```bash
cd backend
```

> **What this does:** Changes your current directory to the `backend` folder where `server.js` lives.

### Step 4: Install Dependencies

```bash
npm install
```

> **What this does:** Reads `package.json` and downloads all required libraries into a `node_modules/` folder. This installs:
> - `express` — Web framework
> - `cors` — Allows browser requests
> - `bcryptjs` — Password hashing
> - `jsonwebtoken` — Authentication tokens
> - `multer` — File uploads
> - `uuid` — Unique IDs
> - `marked` — Markdown parser
> - `express-rate-limit` — Prevent abuse
> - `nodemon` — Auto-restart on file changes (dev tool)

You'll see npm downloading packages. Wait until it completes.

### Step 5: Start the Server

**For development (auto-restarts when you save files):**
```bash
npm run dev
```

**For production (manual restart required):**
```bash
npm start
```

You should see this output:
```
✅ Default admin user created: admin / admin123
✅ Sample articles seeded

🚀 Personal Blog running at http://localhost:3000
📝 Admin Panel: http://localhost:3000/admin/login
```

> **What this does:** Starts your Node.js server on port 3000. The `nodemon` tool (in dev mode) watches for file changes and automatically restarts the server.

### Step 6: Open in Your Browser

Open your web browser and visit:

| URL | What you see |
|-----|-------------|
| `http://localhost:3000` | Public blog homepage |
| `http://localhost:3000/admin/login` | Admin login page |
| `http://localhost:3000/admin` | Dashboard (after login) |
| `http://localhost:3000/admin/editor` | Create new article |

---

## 🔑 Default Login Credentials

```
Username: admin
Password: admin123
```

> ⚠️ **Change these** after your first login in a production setup!

---

## ✍️ How to Write & Publish Articles

### Creating a New Article

1. Go to `http://localhost:3000/admin/login`
2. Sign in with `admin` / `admin123`
3. Click **"+ New Article"** or go to **"✏️ New Article"** in the sidebar
4. Fill in:
   - **Title** — Article headline
   - **Tags** — Comma-separated: `nodejs, javascript, tutorial`
   - **Excerpt** — Short 1-2 sentence description
   - **Cover URL** — Optional image URL for cover photo
   - **Content** — Write in **Markdown** (see guide below)
5. Watch the **live preview** on the right panel update in real-time
6. Click **"Save Draft"** to save without publishing
7. Click **"Publish ✓"** to make it live on your blog

### Editing an Existing Article

1. Go to the **Dashboard** (`/admin`)
2. Find your article in the table
3. Click the **"Edit"** button
4. Make changes — the editor auto-saves drafts every 5 seconds
5. Click **"Publish ✓"** when done

### Deleting an Article

1. Go to the **Dashboard**
2. Click **"Del"** next to the article
3. Confirm the deletion

---

## 📝 Markdown Writing Guide

The editor uses Markdown. Here's a quick reference:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`inline code`

[Link text](https://example.com)
![Image alt](https://image-url.com/photo.jpg)

> This is a blockquote

- Bullet item 1
- Bullet item 2

1. Numbered item 1
2. Numbered item 2

---  (horizontal line)

```javascript
// Code block with syntax highlighting
const message = "Hello World";
console.log(message);
```
```

---

## 🌐 API Reference

All API endpoints are available at `http://localhost:3000/api/`

### Public Endpoints (no login required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List published articles |
| GET | `/api/articles?search=nodejs` | Search articles |
| GET | `/api/articles?tag=javascript` | Filter by tag |
| GET | `/api/articles?page=2&limit=6` | Paginate results |
| GET | `/api/articles/:slug` | Get single article |
| GET | `/api/articles/tags` | Get all tags |
| GET | `/api/health` | Health check |

### Admin Endpoints (requires login token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → get token |
| GET | `/api/auth/me` | Get my profile |
| PUT | `/api/auth/profile` | Update profile/password |
| GET | `/api/articles/all` | All articles (inc. drafts) |
| GET | `/api/articles/stats` | Dashboard statistics |
| GET | `/api/articles/id/:id` | Get article by ID |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |
| POST | `/api/upload/image` | Upload cover image |

### Testing the API in VS Code

Create a file `test.http` in your project and use the **REST Client** extension:

```http
### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

### List Articles
GET http://localhost:3000/api/articles

### Create Article (replace TOKEN below)
POST http://localhost:3000/api/articles
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "title": "My First Article",
  "content": "# Hello World\n\nThis is my first blog post!",
  "tags": ["intro", "hello"],
  "status": "published"
}
```

Click the **"Send Request"** link above each request to test it.

---

## ⚙️ Configuration

### Change the Port

By default the server runs on port **3000**. To change it:

```bash
# Windows (PowerShell)
$env:PORT=8080; npm run dev

# Mac/Linux
PORT=8080 npm run dev
```

### Change JWT Secret (Important for Production!)

Open `backend/middleware/auth.js` and change:
```javascript
const JWT_SECRET = 'blog_secret_key_change_in_production';
// Change to something long and random, e.g.:
const JWT_SECRET = 'xK9$mP2#nQ8@wR5!vL3&hJ6*uN4^';
```

### Data Storage

All data is stored as JSON files in `backend/data/`:
- `data/articles.json` — All your articles
- `data/users.json` — Admin user(s)

These are created automatically on first run.

---

## 🔄 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with auto-restart (development) |
| `npm start` | Start normally (production) |
| `npm install <package>` | Add a new package |
| `Ctrl+C` | Stop the server |

---

## 🛠️ Troubleshooting

### "Port already in use" error
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID_NUMBER>
```

### "Cannot find module" error
```bash
# Re-install dependencies
rm -rf node_modules
npm install
```

### "401 Unauthorized" in API calls
- Your token has expired (tokens last 24 hours)
- Log out and log back in at `/admin/login`

### Articles not saving
- Make sure the server is running (`npm run dev`)
- Check the terminal for error messages
- Verify the `backend/data/` folder exists

### Page shows blank / not found
- Make sure you are visiting `http://localhost:3000` (not 3001 or 80)
- Check the terminal — the server must be running

---

## 🚀 Deploying to Production

### Option 1: Railway (Free tier available)
1. Push your code to GitHub
2. Go to https://railway.app
3. Connect your GitHub repo
4. Set the **Start Command** to: `cd backend && npm start`
5. Add environment variable: `JWT_SECRET=your_secret_here`

### Option 2: Render (Free tier available)
1. Push to GitHub
2. Go to https://render.com → New Web Service
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `npm start`

### Option 3: VPS / Server
```bash
# On your server
git clone your-repo
cd personal-blog/backend
npm install
npm start

# Use PM2 to keep it running:
npm install -g pm2
pm2 start server.js --name "blog"
pm2 startup  # Auto-start on reboot
```

---

## 📦 Features Summary

| Feature | Details |
|---------|---------|
| ✅ Public blog | Paginated article listing with search |
| ✅ Tag filtering | Filter articles by topic tags |
| ✅ Article view counter | Tracks views per article |
| ✅ Markdown editor | Live split-pane preview |
| ✅ Draft / Publish | Workflow for articles |
| ✅ Auto-save | Saves draft every 5 seconds |
| ✅ Admin dashboard | Stats + article management |
| ✅ JWT auth | Secure token-based login |
| ✅ Image uploads | Cover photos for articles |
| ✅ Rate limiting | Protects against API abuse |
| ✅ JSON storage | No database setup required |
| ✅ Responsive design | Works on mobile & desktop |

---

*Happy blogging! ✍️*
