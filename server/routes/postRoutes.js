import PostController from '../controllers/PostsController.js';
import LikesController from "../controllers/LikesController.js";
import commentController from '../controllers/commentsController.js';
import auth from '../middlewares/auth.js';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/v1/posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve all posts
 *     tags:
 *       - Posts
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: Success
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *       responses:
 *         '201':
 *           description: Created
 */
router.post('/posts', auth, PostController.createPost);
router.get('/posts', auth, PostController.getAllPosts);

/**
 * @openapi
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get a post
 *     description: Retrieve a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 *   put:
 *     summary: Update a post
 *     description: Update a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: content
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       '201':
 *         description: Created
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Deleted
 */
router.get('/posts/:id', auth, PostController.getPost);
router.put('/posts/:id', auth, PostController.updatePosts);
router.delete('/posts/:id', auth, PostController.deletePost);

/**
 * @openapi
 * /api/v1/posts/{id}/likes:
 *   get:
 *     summary: Get likes for a post
 *     description: Retrieve likes for a post by ID
 *     tags:
 *       - Likes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 *   post:
 *     summary: Like a post
 *     description: Like a post by ID
 *     tags:
 *       - Likes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 *   delete:
 *     summary: Unlike a post
 *     description: Unlike a post by ID
 *     tags:
 *       - Likes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post('/posts/:id/likes', auth, LikesController.likePost);
router.get('/posts/:id/likes', auth, LikesController.getPostLikes);
router.delete('/posts/:id/likes', auth, LikesController.unlikePost);

/**
 * @openapi
 * /api/v1/posts/{id}/comments:
 *   get:
 *     summary: Get comments for a post
 *     description: Retrieve comments for a post by ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 *   post:
 *     summary: Create a comment for the post
 *     description: Create a comment for a post by ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: content
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 *   delete:
 *     summary: Delete a comment for the post
 *     description: Delete a comment for a post by ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: commentId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post('/posts/:id/comments', auth, commentController.createComment);
router.get('/posts/:id/comments', auth, commentController.getComments);
router.delete('/posts/:id/comments/:commentId', auth, commentController.deleteComment);

export default router;
