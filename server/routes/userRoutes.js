import UserController from '../controllers/UsersController.js';
import FollowerController from '../controllers/FollowerController.js';
import auth from '../middlewares/auth.js';
import { Router } from 'express';

const router = Router();

// Routes for all users
router.get('/users', auth, UserController.getUsers);
router.post('/users', auth, UserController.createUser);

// Route for searching users
router.get('/users/search', auth, UserController.searchUser);

// Routes for a single user
router.get('/users/:id', auth, UserController.getUser);
router.put('/users/:id', auth, UserController.updateUser);
router.delete('/users/:id', auth, UserController.deleteUser);

// Routes for the authenticated user
router.get('/me', auth, UserController.getMe);

// Routes for following and unfollowing a user
router.post('/users/:id/follow', auth, FollowerController.followUser);
router.delete('/users/:id/unfollow', auth, FollowerController.unfollowUser);

// Routes for getting a user's followers and following
router.get('/users/:id/followers', auth, FollowerController.getFollowers);
router.get('/users/:id/following', auth, FollowerController.getFollowing);

export default router;
