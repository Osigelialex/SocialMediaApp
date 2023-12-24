import PostController from '../controllers/PostsController.js';
import LikesController from "../controllers/LikesController.js";
import commentController from '../controllers/commentsController.js';
import auth from '../middlewares/auth.js';
import { Router } from 'express';

const router = Router();

// Routes for posts
router.post('/posts', auth, PostController.createPost);
router.get('/posts', auth, PostController.getAllPosts);
router.get('/posts/:id', auth, PostController.getPost);
router.put('/posts/:id', auth, PostController.updatePosts);
router.delete('/posts/:id', auth, PostController.deletePost);

// Routes for likes
router.post('/posts/:id/likes', auth, LikesController.likePost);
router.get('/posts/:id/likes', auth, LikesController.getPostLikes);
router.delete('/posts/:id/likes', auth, LikesController.unlikePost);

// Routes for comments
router.post('/posts/:id/comments', auth, commentController.createComment);
router.get('/posts/:id/comments', auth, commentController.getComments);
router.delete('/posts/:id/comments/:commentId', auth, commentController.deleteComment);

export default router;
