const express = require('express');
const path = require('path');
const getAuthControllers = require(path.resolve(__dirname, '../controllers/auth'));

const getAuthRoutes = (db) => {
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

module.exports = getAuthRoutes;
