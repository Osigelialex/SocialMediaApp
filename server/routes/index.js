import UsersController from '../controllers/UsersController.js';
import PostsController from '../controllers/PostsContoller.js';
import auth from '../middlewares/auth.js';
import { Router } from 'express';

const router = Router();

router.post('/register', UsersController.register);

router.post('/login', UsersController.login);

router.get('/users', UsersController.getUsers);

router.get('/hello', auth, PostsController.hello);

export default router;
