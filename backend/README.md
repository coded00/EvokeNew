# EVOKE Backend API

Backend API for the Evoke event management and ticketing platform.

## 🚀 Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **User Management**: Registration, login, profile management
- **Event Management**: Create, read, update, delete events
- **Ticket System**: Purchase, validate, and transfer tickets
- **Payment Integration**: Stripe and Paystack payment processing
- **Real-time Features**: WebSocket support for live updates
- **Security**: Rate limiting, CORS, helmet security headers
- **TypeScript**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL (for production)
- Redis (for caching and sessions)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Evoke-V2/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration values.

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Development

### Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer your-access-token
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "location": "New York"
}
```

### Health Check
```http
GET /health
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3001` |
| `API_VERSION` | API version | `v1` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:5173` |

### Database Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `DATABASE_TEST_URL` | Test database URL | Required |

### Payment Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | Required |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Required |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | Required |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | Required |

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent abuse with request limiting
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers middleware
- **Input Validation**: Request validation and sanitization

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=3001
   # ... other production variables
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@evoke.com or create an issue in the repository. 