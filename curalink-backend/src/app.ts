// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

// Route imports
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';
import clinicalTrialRoutes from './routes/clinicalTrials';
import publicationRoutes from './routes/publications';
import expertRoutes from './routes/experts';
import forumRoutes from './routes/forums';
import dashboardRoutes from './routes/dashboard';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env['CLIENT_URL'] || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Root route - MUST come before 404 handler
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'CuraLink Backend API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/clinical-trials',
      '/api/publications',
      '/api/experts',
      '/api/forums',
      '/api/dashboard',
      '/api/ai'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    message: 'CuraLink API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clinical-trials', clinicalTrialRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env['NODE_ENV'] === 'development' ? err.message : {}
  });
});

// 404 handler - MUST BE LAST
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/clinical-trials',
      'GET /api/publications',
      'GET /api/experts',
      'GET /api/forums',
      'GET /api/dashboard',
      'POST /api/ai/chat'
    ]
  });
});

const PORT = process.env['PORT'] || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CuraLink Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  console.log(`🌐 Health check: /api/health`);
});

export default app;