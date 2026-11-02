import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import caseRoutes from './routes/caseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_mystery_room';

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if in allowed list
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for competition preview
  },
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected/in-memory';
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key');
  
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    database: dbStatus,
    geminiConfigured: hasGeminiKey,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/cases', caseRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Database connection & Server start
async function startServer() {
  try {
    console.log('[Database] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('✅ [Database] MongoDB connected successfully.');
  } catch (err) {
    console.warn(`⚠️ [Database] MongoDB connection failed (${err.message}).`);
    console.warn('ℹ️ [Database] Running with In-Memory storage fallback. Perfect for local evaluation!');
  }

  app.listen(PORT, () => {
    console.log(`🕵️ [Server] AI Mystery Room backend listening on port ${PORT}`);
    console.log(`🔗 [Server] Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();

