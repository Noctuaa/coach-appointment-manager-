import express from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', authMiddleware, roleMiddleware(['user']), AuthController.logout);
router.get('/me', authMiddleware, roleMiddleware(['user']), AuthController.me);


export default router;