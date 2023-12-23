import commentController from "../controllers/commentsController.js";
import auth from "../middlewares/auth.js";
import { Router } from 'express';

const router = Router();

router.get('/comments/:postId', auth, commentController.getComments);

router.post('/comments/:postId', auth, commentController.createComment);

router.delete('/comments/:commentId', auth, commentController.deleteComment);

export default router;
