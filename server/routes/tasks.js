const express = require('express');
const path = require('path');
const getTasksControllers = require(path.resolve(__dirname, '../controllers/tasks'));

const getTasksRoutes = (db) => {
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

module.exports = getTasksRoutes;
