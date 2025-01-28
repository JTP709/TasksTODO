import express from 'express';
import getAuthControllers from '../controllers/auth';
import { Database } from 'sqlite3';

const getAuthRoutes = (db: Database) => {
  const router = express.Router();
  const {
    signup,
    login,
    logout,
  } = getAuthControllers(db);

  router.post('/signup', signup);
  router.post('/login', login);
  router.post('/logout', logout);

  return router;
};

export default getAuthRoutes;
