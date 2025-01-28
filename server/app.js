const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const getAuthRoutes = require('./routes/auth');
const getTasksRoutes = require('./routes/tasks');
const connectToDatabase = require('./model');
const authentication = require(path.resolve(__dirname, './middleware/authentication'));

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const db = connectToDatabase(app);

app.use('/api/auth', getAuthRoutes(db))
app.use('/api/tasks', authentication);
app.use('/api/tasks', getTasksRoutes(db));
