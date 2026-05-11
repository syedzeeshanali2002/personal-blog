const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getArticles, saveArticles } = require('../middleware/dataStore');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

// GET /api/articles - Public: list published articles
router.get('/', (req, res) => {
  const { tag, search, page = 1, limit = 6 } = req.query;
  let articles = getArticles().filter(a => a.status === 'published');

  if (tag) articles = articles.filter(a => a.tags.includes(tag));
  if (search) {
    const q = search.toLowerCase();
    articles = articles.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
  }

  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const total = articles.length;
  const start = (page - 1) * limit;
  const paginated = articles.slice(start, start + parseInt(limit));

  res.json({ articles: paginated, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
});

// GET /api/articles/all - Admin: all articles
router.get('/all', authenticateToken, (req, res) => {
  const articles = getArticles().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ articles });
});

// GET /api/articles/tags - Get all unique tags
router.get('/tags', (req, res) => {
  const articles = getArticles().filter(a => a.status === 'published');
  const tags = [...new Set(articles.flatMap(a => a.tags))].sort();
  res.json({ tags });
});

// GET /api/articles/stats - Admin stats
router.get('/stats', authenticateToken, (req, res) => {
  const articles = getArticles();
  const published = articles.filter(a => a.status === 'published');
  const drafts = articles.filter(a => a.status === 'draft');
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const allTags = [...new Set(articles.flatMap(a => a.tags))];
  const recent = [...published].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 5);
  res.json({ totalArticles: articles.length, published: published.length, drafts: drafts.length, totalViews, totalTags: allTags.length, recent });
});

// GET /api/articles/:slug - Public: single article by slug
router.get('/:slug', (req, res) => {
  const articles = getArticles();
  const article = articles.find(a => a.slug === req.params.slug && a.status === 'published');
  if (!article) return res.status(404).json({ error: 'Article not found' });

  // Increment views
  const idx = articles.findIndex(a => a.id === article.id);
  articles[idx].views = (articles[idx].views || 0) + 1;
  saveArticles(articles);

  res.json(articles[idx]);
});

// GET /api/articles/id/:id - Admin: single article by id
router.get('/id/:id', authenticateToken, (req, res) => {
  const article = getArticles().find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// POST /api/articles - Create article
router.post('/', authenticateToken, (req, res) => {
  const { title, content, excerpt, tags, status, coverImage } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  const articles = getArticles();
  let slug = slugify(title);
  // Ensure unique slug
  let counter = 1;
  while (articles.find(a => a.slug === slug)) { slug = `${slugify(title)}-${counter++}`; }

  const now = new Date().toISOString();
  const article = {
    id: uuidv4(),
    title,
    slug,
    excerpt: excerpt || content.replace(/#{1,6}\s/g, '').substring(0, 160) + '...',
    content,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [],
    status: status || 'draft',
    coverImage: coverImage || '',
    author: req.user.name,
    createdAt: now,
    updatedAt: now,
    publishedAt: status === 'published' ? now : null,
    views: 0
  };

  articles.push(article);
  saveArticles(articles);
  res.status(201).json({ message: 'Article created', article });
});

// PUT /api/articles/:id - Update article
router.put('/:id', authenticateToken, (req, res) => {
  const articles = getArticles();
  const idx = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });

  const { title, content, excerpt, tags, status, coverImage } = req.body;
  const old = articles[idx];

  if (title && title !== old.title) {
    let slug = slugify(title);
    let counter = 1;
    while (articles.find((a, i) => a.slug === slug && i !== idx)) { slug = `${slugify(title)}-${counter++}`; }
    articles[idx].slug = slug;
    articles[idx].title = title;
  }

  if (content !== undefined) articles[idx].content = content;
  if (excerpt !== undefined) articles[idx].excerpt = excerpt;
  if (coverImage !== undefined) articles[idx].coverImage = coverImage;
  if (tags !== undefined) articles[idx].tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
  if (status !== undefined) {
    articles[idx].status = status;
    if (status === 'published' && !old.publishedAt) articles[idx].publishedAt = new Date().toISOString();
  }
  articles[idx].updatedAt = new Date().toISOString();

  saveArticles(articles);
  res.json({ message: 'Article updated', article: articles[idx] });
});

// DELETE /api/articles/:id - Delete article
router.delete('/:id', authenticateToken, (req, res) => {
  const articles = getArticles();
  const idx = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });
  articles.splice(idx, 1);
  saveArticles(articles);
  res.json({ message: 'Article deleted' });
});

module.exports = router;
