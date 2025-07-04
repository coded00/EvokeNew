import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
} from '../controllers/authController';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router; 