const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const briefRoutes = require('./routes/briefRoutes');
const { setupSwagger } = require('./swagger/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/briefs', briefRoutes);

setupSwagger(app);

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

module.exports = app;
