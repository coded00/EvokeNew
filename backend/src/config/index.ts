import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface DatabaseConfig {
  url: string;
  testUrl: string;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

interface ServerConfig {
  port: number;
  nodeEnv: string;
  apiVersion: string;
}

interface SecurityConfig {
  bcryptRounds: number;
  sessionSecret: string;
  corsOrigin: string;
  allowedOrigins: string[];
}

interface FileUploadConfig {
  uploadPath: string;
  maxFileSize: number;
  allowedFileTypes: string[];
}

interface PaymentConfig {
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  paystack: {
    secretKey: string;
    publicKey: string;
  };
}

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface AWSConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3Bucket: string;
}

interface LoggingConfig {
  level: string;
  file: string;
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  security: SecurityConfig;
  fileUpload: FileUploadConfig;
  payment: PaymentConfig;
  email: EmailConfig;
  rateLimit: RateLimitConfig;
  aws: AWSConfig;
  logging: LoggingConfig;
  redis: {
    url: string;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env['PORT'] || '3001', 10),
    nodeEnv: process.env['NODE_ENV'] || 'development',
    apiVersion: process.env['API_VERSION'] || 'v1',
  },
  database: {
    url: process.env['DATABASE_URL'] || 'postgresql://username:password@localhost:5432/evoke_db',
    testUrl: process.env['DATABASE_TEST_URL'] || 'postgresql://username:password@localhost:5432/evoke_test_db',
  },
  jwt: {
    secret: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret-key',
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '30d',
  },
  security: {
    bcryptRounds: parseInt(process.env['BCRYPT_ROUNDS'] || '12', 10),
    sessionSecret: process.env['SESSION_SECRET'] || 'your-session-secret-key',
    corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
    allowedOrigins: (process.env['ALLOWED_ORIGINS'] || 'http://localhost:5173,http://localhost:3000').split(','),
  },
  fileUpload: {
    uploadPath: process.env['UPLOAD_PATH'] || './uploads',
    maxFileSize: parseInt(process.env['MAX_FILE_SIZE'] || '10485760', 10), // 10MB
    allowedFileTypes: (process.env['ALLOWED_FILE_TYPES'] || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
  },
  payment: {
    stripe: {
      secretKey: process.env['STRIPE_SECRET_KEY'] || '',
      publishableKey: process.env['STRIPE_PUBLISHABLE_KEY'] || '',
      webhookSecret: process.env['STRIPE_WEBHOOK_SECRET'] || '',
    },
    paystack: {
      secretKey: process.env['PAYSTACK_SECRET_KEY'] || '',
      publicKey: process.env['PAYSTACK_PUBLIC_KEY'] || '',
    },
  },
  email: {
    host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
    port: parseInt(process.env['SMTP_PORT'] || '587', 10),
    user: process.env['SMTP_USER'] || '',
    pass: process.env['SMTP_PASS'] || '',
    from: process.env['EMAIL_FROM'] || 'noreply@evoke.com',
  },
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
  },
  aws: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || '',
    region: process.env['AWS_REGION'] || 'us-east-1',
    s3Bucket: process.env['AWS_S3_BUCKET'] || 'evoke-uploads',
  },
  logging: {
    level: process.env['LOG_LEVEL'] || 'info',
    file: process.env['LOG_FILE'] || './logs/app.log',
  },
  redis: {
    url: process.env['REDIS_URL'] || 'redis://localhost:6379',
  },
};

export default config; 