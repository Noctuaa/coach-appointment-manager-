import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/signup', AuthController.signup);

export default router;