import express from 'express';
import getTasksControllers from '../controllers/tasks';
import { Database } from 'sqlite3';

const getTasksRoutes = (db: Database) => {
  const router = express.Router();
  const {
    get_tasks,
    post_tasks,
    put_tasks,
    delete_tasks,
  } = getTasksControllers(db);

  router.get('/', get_tasks);
  router.post('/', post_tasks);
  router.put('/:id', put_tasks);
  router.delete('/:id', delete_tasks);

  return router;
};

export default getTasksRoutes;
