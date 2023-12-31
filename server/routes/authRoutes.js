import AuthController from '../controllers/AuthController.js';
import { Router } from 'express';
import auth from "../middlewares/auth.js";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *      - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully registered
 */
router.post('/auth/register', AuthController.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in user and obtain JWT
 *     tags:
 *      - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully authenticated
 */
router.post('/auth/login', AuthController.login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   get:
 *     summary: Refresh the JWT token
 *     tags:
 *      - Authentication
 *     security:
 *      - jwt: []
 *     responses:
 *       '200':
 *         description: Successfully refreshed the token
 */
router.get('/auth/refresh', AuthController.refresh);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout
 *     tags:
 *       - Authentication
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: Successfully logged out
 */
router.get('/auth/logout', auth, AuthController.logout);

export default router;
