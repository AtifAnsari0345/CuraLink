const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'https://your-vercel-app.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      llm: 'structured-fallback-ready'
    }
  });
});

// Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/research', require('./routes/research'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/users', require('./routes/user'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/network', require('./routes/network'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Catch-all undefined routes - LAST
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/curalink';

// Attempt to connect to configured MongoDB. In development, if unavailable, 
// use mongodb-memory-server. In production, fail immediately.
// Start the Express server only after a successful mongoose connection to avoid 
// buffering timeouts when handlers call models before the DB is ready.

async function initDbAndStart() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ MongoDB connected to:', MONGO_URI.includes('localhost') ? 'local' : 'Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }

  // Start the HTTP server after DB connection is ready
  app.listen(PORT, () => {
    console.log(`✅ Curalink API running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  });
}

// Initialize DB and start server; surface any unhandled promise errors
initDbAndStart().catch(err => {
  console.error('Failed to initialize database and start server:', err);
  process.exit(1);
});

module.exports = app;
