import PostController from '../controllers/PostsController.js';
import auth from '../middlewares/auth.js';
import { Router } from 'express';

const router = Router();

router.get('/posts/:id', auth, PostController.getPost);

router.post('/posts', auth, PostController.createPost);

router.get('/posts', auth, PostController.getAllPosts);

router.put('/posts/:id', auth, PostController.updatePosts);

router.delete('/posts/:id', auth, PostController.deletePost);

export default router;
