import express from 'express';
import { createMessage, getAllMessages, getUnreadCount, markAsRead, deleteMessage } from '../controllers/messageController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/messages - Create a new message (public)
router.post('/', createMessage);

// GET /api/messages - Get all messages (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllMessages);

// GET /api/messages/unread-count - Get unread message count (admin only)
router.get('/unread-count', authMiddleware, adminMiddleware, getUnreadCount);

// PUT /api/messages/:id/read - Mark message as read (admin only)
router.put('/:id/read', authMiddleware, adminMiddleware, markAsRead);

// DELETE /api/messages/:id - Delete a message (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteMessage);

export default router; 