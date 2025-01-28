import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './model';
import getAuthRoutes from './routes/auth';
import authentication from './middleware/authentication';
import getTasksRoutes from './routes/tasks';

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
