const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// ─── Ensure data directory exists ────────────────────────────────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── Articles ─────────────────────────────────────────────────────────────────
function getArticles() { return readJSON(ARTICLES_FILE); }
function saveArticles(articles) { writeJSON(ARTICLES_FILE, articles); }

// ─── Users ───────────────────────────────────────────────────────────────────
function getUsers() { return readJSON(USERS_FILE); }
function saveUsers(users) { writeJSON(USERS_FILE, users); }

// ─── Seed default admin user if none exists ───────────────────────────────────
const bcrypt = require('bcryptjs');
if (getUsers().length === 0) {
  const hashed = bcrypt.hashSync('admin123', 10);
  saveUsers([{ id: '1', username: 'admin', password: hashed, email: 'admin@blog.com', name: 'Blog Admin' }]);
  console.log('✅ Default admin user created: admin / admin123');
}

// ─── Seed sample articles if none exist ──────────────────────────────────────
if (getArticles().length === 0) {
  const now = new Date().toISOString();
  saveArticles([
    {
      id: '1',
      title: 'Welcome to My Blog',
      slug: 'welcome-to-my-blog',
      excerpt: 'This is the first post on my personal blog. Excited to share my thoughts and ideas here.',
      content: '# Welcome to My Blog\n\nThank you for visiting! This blog is where I share my thoughts on technology, life, and everything in between.\n\n## What to Expect\n\n- **Tech Articles**: Deep dives into programming, tools, and frameworks\n- **Personal Stories**: Life experiences and lessons learned\n- **Tutorials**: Step-by-step guides on various topics\n\n## Getting Started\n\nFeel free to explore the articles. If you enjoy the content, consider sharing it with others!\n\n```javascript\nconst blog = {\n  author: "Admin",\n  passion: "Writing & Coding",\n  goal: "Share knowledge"\n};\nconsole.log("Happy reading!", blog);\n```\n\nStay tuned for more content coming soon!',
      tags: ['welcome', 'introduction'],
      status: 'published',
      coverImage: '',
      author: 'Blog Admin',
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      views: 42
    },
    {
      id: '2',
      title: 'Getting Started with Node.js',
      slug: 'getting-started-with-nodejs',
      excerpt: 'Node.js is a powerful JavaScript runtime. Let\'s explore how to build your first backend application.',
      content: '# Getting Started with Node.js\n\nNode.js allows you to run JavaScript on the server. It\'s fast, efficient, and has a massive ecosystem.\n\n## Installation\n\nDownload Node.js from [nodejs.org](https://nodejs.org) and install it on your machine.\n\n## Your First Server\n\n```javascript\nconst http = require(\'http\');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { \'Content-Type\': \'text/plain\' });\n  res.end(\'Hello World!\');\n});\n\nserver.listen(3000, () => {\n  console.log(\'Server running on port 3000\');\n});\n```\n\n## Why Node.js?\n\n1. **Non-blocking I/O** - Handles many connections simultaneously\n2. **NPM Ecosystem** - Millions of packages available\n3. **Same language** - JavaScript on both frontend and backend\n\nHappy coding!',
      tags: ['nodejs', 'javascript', 'backend'],
      status: 'published',
      coverImage: '',
      author: 'Blog Admin',
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      views: 128
    }
  ]);
  console.log('✅ Sample articles seeded');
}

module.exports = { getArticles, saveArticles, getUsers, saveUsers };
