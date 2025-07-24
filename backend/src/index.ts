import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';

// Import security middleware
import securityMiddleware, { createRateLimiters } from './middleware/security';

// Import routes
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import emailRoutes from './routes/email';
import paymentRoutes from './routes/payment';
import WebSocketServer from './websocket/websocketServer';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// Enhanced security middleware
app.use(securityMiddleware.securityHeaders);
app.use(securityMiddleware.validateIP);
app.use(securityMiddleware.sanitizeRequest);
app.use(securityMiddleware.securityLogger);
app.use(securityMiddleware.requestSizeLimiter);

// CORS configuration
app.use(cors(securityMiddleware.corsConfig));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Initialize rate limiters
const rateLimiters = createRateLimiters();

// Global rate limiting
app.use(rateLimiters.globalLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/payment', paymentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({ error: 'Internal server error', message: error.message });
  return;
});

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
const wsServer = new WebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📤 Upload endpoints: http://localhost:${PORT}/api/v1/upload`);
  console.log(`📧 Email endpoints: http://localhost:${PORT}/api/v1/email`);
  console.log(`💳 Payment endpoints: http://localhost:${PORT}/api/v1/payment`);
  console.log(`🔌 WebSocket server: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  wsServer.shutdown();
  server.close(() => {
    console.log('🔌 HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  wsServer.shutdown();
  server.close(() => {
    console.log('🔌 HTTP server closed');
    process.exit(0);
  });
});

export default app; 