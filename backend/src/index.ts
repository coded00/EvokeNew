import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/index';

// Import routes
import authRoutes from './routes/auth';
// import eventRoutes from './routes/events';
// import userRoutes from './routes/users';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.security.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    version: config.server.apiVersion,
  });
});

// API routes
app.use(`/api/${config.server.apiVersion}/auth`, authRoutes);

// Base API endpoint
app.get(`/api/${config.server.apiVersion}`, (_req, res) => {
  res.json({
    message: 'EVOKE API is running!',
    version: config.server.apiVersion,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: `/api/${config.server.apiVersion}/auth`,
      health: '/health',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  const statusCode = (err as any).statusCode || 500;
  const message = (err as any).message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(config.server.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`🚀 EVOKE Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 API Version: ${config.server.apiVersion}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api/${config.server.apiVersion}`);
});

export default app; 