const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Frontend Routes ──────────────────────────────────────────────────────────
const frontendPath = path.join(__dirname, '../frontend/public');

app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
app.get('/article/:slug', (req, res) => res.sendFile(path.join(frontendPath, 'article.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(frontendPath, 'admin.html')));
app.get('/admin/editor', (req, res) => res.sendFile(path.join(frontendPath, 'editor.html')));
app.get('/admin/login', (req, res) => res.sendFile(path.join(frontendPath, 'login.html')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`\n🚀 Personal Blog running at http://localhost:${PORT}`);
  console.log(`📝 Admin Panel: http://localhost:${PORT}/admin/login`);
  console.log(`\n📌 Default credentials: admin / admin123\n`);
});
