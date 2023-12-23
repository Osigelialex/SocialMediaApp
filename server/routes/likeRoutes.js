import LikeController from '../controllers/LikesController.js';
import auth from '../middlewares/auth.js';
import { Router } from 'express';

const router = Router();

router.post('/likes/:postId', auth, LikeController.likePost);

router.get('/likes/:postId', auth, LikeController.getPostLikes);

router.delete('/likes/:postId', auth, LikeController.unlikePost);

export default router;
