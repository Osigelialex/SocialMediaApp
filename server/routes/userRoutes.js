import UserController from '../controllers/UsersController.js';
import FollowerController from '../controllers/FollowerController.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/imageUpload.js';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users
 *     tags:
 *       - Users
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: Success
 *   post:
 *     summary: Create a new user
 *     description: Create a new user
 *     tags:
 *       - Users
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Created
 */
router.get('/users', auth, UserController.getUsers);
router.post('/users', auth, UserController.createUser);

/**
 * @openapi
 * /api/v1/users/search:
 *   get:
 *     summary: Search for a user
 *     description: Search for a user by username or display name
 *     tags:
 *       - Users
 *     parameters:
 *       - name: query
 *         description: User's username or display name
 *         in: query
 *     responses:
 *       '200':
 *         description: Success
 */
router.get('/users/search', auth, UserController.searchUser);

// Routes for the authenticated user
/**
 * @openapi
 * /api/v1/me:
 *   get:
 *     summary: Get information about the authenticated user
 *     description: Get information about the authenticated user
 *     tags:
 *       - Users
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: Success
 */
router.get('/me', auth, UserController.getMe);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user by ID
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: Success
 *   put:
 *     summary: Update a user's information
 *     description: Update a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: avatar
 *         in: formData
 *         type: file
 *       - name: displayname
 *         in: formData
 *         type: string
 *       - name: username
 *         in: formData
 *         type: string
 *       - name: bio
 *         in: formData
 *         type: string
 *       - name: location
 *         in: formData
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.get('/users/:id', auth, UserController.getUser);
router.put('/users/:id', auth, upload.single('avatar'), UserController.updateUser);
router.delete('/users/:id', auth, UserController.deleteUser);

/**
 * @openapi
 * /api/v1/users/{id}/follow:
 *   post:
 *     summary: Follow a user
 *     description: Follow a user by ID
 *     tags:
 *       - Followers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post('/users/:id/follow', auth, FollowerController.followUser);

/**
 * @openapi
 * /api/v1/users/{id}/unfollow:
 *   delete:
 *     summary: Unfollow a user
 *     description: Unfollow a user by ID
 *     tags:
 *       - Followers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.delete('/users/:id/unfollow', auth, FollowerController.unfollowUser);

/**
 * @openapi
 * /api/v1/users/{id}/followers:
 *   get:
 *     summary: Get followers for a user
 *     description: Get followers for a user by ID
 *     tags:
 *       - Followers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.get('/users/:id/followers', auth, FollowerController.getFollowers);

/**
 * @openapi
 * /api/v1/users/{id}/following:
 *   get:
 *     summary: Get users a user follows
 *     description: Get users a user follows by ID
 *     tags:
 *       - Followers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.get('/users/:id/following', auth, FollowerController.getFollowing);

export default router;
