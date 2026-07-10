import express from 'express';
import { registerCustomer, loginCustomer, getProfile } from '../controllers/customerController.js';
import { customerAuthMiddleware } from '../middleware/customerAuthMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

// Protected routes
router.get('/profile', customerAuthMiddleware, getProfile);

export default router;
