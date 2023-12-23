import UserController from '../controllers/UsersController.js';
import auth from '../middlewares/auth.js';
import { Router } from 'express';

const router = Router();

router.get('/users', auth, UserController.getUsers);

router.get('/users/:id', auth, UserController.getUser);

router.put('/users/:id', auth, UserController.updateUser);

router.post('/users', auth, UserController.createUser);

router.delete('/users/:id', auth, UserController.deleteUser);

router.get('/user/search', auth, UserController.searchUser);

router.get('/me', auth, UserController.getMe);

export default router;
