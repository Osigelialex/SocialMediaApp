import AuthController from '../controllers/AuthController.js';
import { Router } from 'express';

const router = Router();

router.post('/auth/register', AuthController.register);

router.post('/auth/login', AuthController.login);

router.get('/auth/refresh', AuthController.refresh);

export default router;
