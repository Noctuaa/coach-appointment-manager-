import express from 'express';
import { validateLogin, validateSignup } from '../validations/authValidations.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import AuthController from '../controllers/AuthController.js';



const router = express.Router();

router.post('/signup', validateSignup, AuthController.signup);
router.post('/login', validateLogin , AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', authMiddleware, roleMiddleware(['user']), AuthController.logout);
router.get('/me', authMiddleware, roleMiddleware(['user']), AuthController.me);


export default router;