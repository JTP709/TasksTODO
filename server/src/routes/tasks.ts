import express from 'express';
import {
  get_tasks,
  post_tasks,
  put_tasks,
  delete_tasks,
} from '../controllers/tasks';

const router = express.Router();

router.get('/', get_tasks);
router.post('/', post_tasks);
router.put('/:id', put_tasks);
router.delete('/:id', delete_tasks);

export default router;
