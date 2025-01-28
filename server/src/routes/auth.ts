import express from 'express';
import authControllers from '../controllers/auth';

const router = express.Router();
const {
  signup,
  login,
  logout,
} = authControllers;

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
