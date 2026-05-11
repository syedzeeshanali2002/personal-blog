const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsers, saveUsers } = require('../middleware/dataStore');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email } });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

// PUT /api/auth/profile - Update profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  if (newPassword) {
    if (!bcrypt.compareSync(currentPassword, users[idx].password)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    users[idx].password = bcrypt.hashSync(newPassword, 10);
  }

  if (name) users[idx].name = name;
  if (email) users[idx].email = email;
  saveUsers(users);

  const { password, ...safeUser } = users[idx];
  res.json({ message: 'Profile updated', user: safeUser });
});

module.exports = router;
