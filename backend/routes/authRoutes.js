import express from 'express';
import { register, login, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/authController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected admin-only routes
router.get('/users', auth, getAllUsers);
router.get('/users/:id', auth, getUserById);
router.put('/users/:id', auth, updateUser);
router.delete('/users/:id', auth, deleteUser);

export default router; 