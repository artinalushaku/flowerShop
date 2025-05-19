import express from 'express';
import { register, login, getAllUsers, getUserById, updateUser, deleteUser, updateProfile } from '../controllers/authController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// User routes - accessible by the authenticated user
router.put('/profile', authMiddleware, updateProfile);

// Protected admin-only routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

export default router; 